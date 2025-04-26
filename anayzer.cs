using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;

namespace AstmSerialWorkerService
{
    public class AnalyzerProtocolHandler
    {
        private readonly ILogger<AnalyzerProtocolHandler> _logger;
        private readonly DatabaseService _db;
        private readonly Settings _settings;

        private string readBuffer = string.Empty;
        private char analyzerResponse;
        private string orderNo = "";
        private string requestedSID = "";

        public AnalyzerProtocolHandler(
            ILogger<AnalyzerProtocolHandler> logger,
            DatabaseService db,
            IOptions<Settings> options)
        {
            _logger = logger;
            _db = db;
            _settings = options.Value;
        }

        public void HandleReceivedData(string data, SerialPort port)
        {
            analyzerResponse = string.IsNullOrEmpty(data) ? '\0' : data[0];
            readBuffer += data;

            LogReceived(data);

            if (data.Contains("\u0005")) // ENQ
            {
                port.Write("\u0006");
                LogSend("\u0006");
            }

            if (readBuffer.EndsWith("\u0004")) // EOT
            {
                ParseASTM(readBuffer, port);
                readBuffer = "";
            }
        }

        private void ParseASTM(string data, SerialPort port)
        {
            string[] frames = data
                .Replace("\u0002", "")
                .Replace("\u0003", "")
                .Replace("\u0004", "")
                .Split('\r');

            foreach (var frame in frames)
            {
                var fields = frame.Split('|');
                if (fields.Length == 0) continue;

                LogSegment("IN", fields[0], frame);

                switch (fields[0])
                {
                    case "P":
                        orderNo = "";
                        break;
                    case "O":
                        if (fields.Length > 3) orderNo = fields[3];
                        break;
                    case "Q":
                        if (fields.Length > 2)
                        {
                            var sidParts = fields[2].Split('^');
                            if (sidParts.Length > 1)
                                requestedSID = sidParts[1];
                        }
                        break;
                    case "R":
                        if (!string.IsNullOrEmpty(orderNo))
                        {
                            var testCode = fields[2].Split('^').ElementAtOrDefault(3) ?? "";
                            var resultValue = fields.ElementAtOrDefault(3) ?? "";
                            _db.SaveResult(orderNo.Split('^')[0], testCode, resultValue);
                        }
                        break;
                }
            }

            if (!string.IsNullOrEmpty(requestedSID))
                OrderTest(port, requestedSID);
        }
        private void SendFrame(SerialPort port, string frame)
        {
            int retry = 0;
            while (retry < 3)
            {
                port.Write(frame);
                LogSend(frame);
                Thread.Sleep(300);

                if (analyzerResponse == '\u0006') return; // ACK
                if (analyzerResponse == '\u0015') retry++; // NAK
            }

            port.Write("\u0004");
            LogSend("[EOT - cancel]");
        }

        public void OrderTest(SerialPort port, string sid)
        {
            // Step 0: Initiate session with ENQ handshake
            port.Write("\u0005"); // ENQ
            LogSend("[ENQ]");
            Thread.Sleep(300);

            if (analyzerResponse != '\u0006') // Expect ACK
            {
                _logger.LogError("Analyzer did not ACK after ENQ, aborting message send.");
                return;
            }

            string raw = _db.GetOTests(sid);
            var parts = raw.Split('¦');
            if (parts.Length < 2) return;

            string patientInfo = parts[0];
            string testCodes = parts[1];

            string testSegment = "^^^" + testCodes.TrimEnd('|').Replace("|", "\\^^^");
            string pSegment = $"P|1||{patientInfo.Split('|')[1]}";
            string oSegment;

            if (_settings.AstmMode?.ToLower() == "elecsys")
            {
                oSegment = $"O|1|{sid}||{testSegment}|R||||||A||||1||||||||||O";
            }
            else // default to cobas
            {
                oSegment = $"O|1|{sid}|{sid}|{testSegment}|R||||||A||||1||||||||||O";
            }

            string[] messages = {
        _settings.AstmMode?.ToLower() == "elecsys"
            ? "H|\\^&|||Elecsys^1||||||RSUPL^REAL|P|1"
            : "H|\\^&|||cobas_e411^1||||||RSUPL^REAL|P|1",
        pSegment,
        oSegment,
        "L|1|"
    };

            var blocks = new List<string>();
            for (int i = 0; i < messages.Length; i++)
            {
                string frame = $"{i + 1}{messages[i]}\r";
                string checksum = GetChecksum(frame);
                string final = $"\u0002{frame}\u0003{checksum}\r\n";
                blocks.Add(final);
            }

            foreach (var block in blocks)
            {
                bool success = false;

                for (int attempt = 0; attempt < 3; attempt++)
                {
                    port.Write(block);
                    LogSend(block);
                    Thread.Sleep(300);

                    if (analyzerResponse == '\u0006') // ACK
                    {
                        success = true;
                        break;
                    }
                    else if (analyzerResponse == '\u0015') // NAK
                    {
                        _logger.LogWarning("NAK received for block, retrying...");
                        continue;
                    }
                }

                if (!success)
                {
                    _logger.LogError("Block failed to send after retries. Sending EOT.");
                    port.Write("\u0004");
                    LogSend("[EOT - ABORT]");
                    return;
                }
            }

            port.Write("\u0004"); // EOT to complete message
            LogSend("[EOT]");
        }

        private string GetChecksum(string data)
        {
            int sum = data.Sum(c => (int)c);
            return (sum & 0xFF).ToString("X2");
        }

        private void LogSend(string message)
        {
            if (_settings.EnableLog)
                _logger.LogInformation("--> " + FormatControl(message));
        }

        private void LogReceived(string message)
        {
            if (_settings.EnableDebug)
                _logger.LogInformation("<-- " + FormatControl(message));
        }

        private void LogSegment(string direction, string segmentType, string data)
        {
            _logger.LogInformation("[{dir}] {type}: {data}", direction, segmentType, FormatControl(data));
        }

        private string FormatControl(string data)
        {
            return data
                .Replace("\u0002", "[STX]")
                .Replace("\u0003", "[ETX]")
                .Replace("\u0004", "[EOT]")
                .Replace("\u0005", "[ENQ]")
                .Replace("\u0006", "[ACK]")
                .Replace("\u0015", "[NAK]");
        }
    }
}
