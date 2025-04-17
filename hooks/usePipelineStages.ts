import { useState, useEffect, useCallback } from 'react';
import { masterDataService } from '@/services/masterDataService';
import { MasterData } from '@/types';

interface PipelineStage {
  _id: string;
  name: string;
  order: number;
  category: string;
  description?: string;
}

/**
 * Hook to fetch and manage pipeline stages from the master data
 */
export function usePipelineStages() {
  const [data, setData] = useState<MasterData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPipelineStages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await masterDataService.getMasterDataByCategory('deal-stages');
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pipeline stages'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPipelineStage = useCallback(async (pipelineStage: Omit<MasterData, '_id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await masterDataService.createMasterData(pipelineStage);
      await fetchPipelineStages();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create pipeline stage'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPipelineStages]);

  const updatePipelineStage = useCallback(async (id: string, pipelineStageData: Partial<MasterData>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await masterDataService.updateMasterData(id, pipelineStageData);
      await fetchPipelineStages();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update pipeline stage'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPipelineStages]);

  const deletePipelineStage = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await masterDataService.deleteMasterData(id);
      await fetchPipelineStages();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete pipeline stage'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPipelineStages]);

  useEffect(() => {
    fetchPipelineStages();
  }, [fetchPipelineStages]);

  return {
    data,
    isLoading,
    isError: error,
    fetchPipelineStages,
    createPipelineStage,
    updatePipelineStage,
    deletePipelineStage,
  };
}
