# InnovCRM

InnovCRM is a comprehensive customer relationship management system designed to help businesses manage their leads, deals, contacts, and sales pipeline efficiently. Built with modern web technologies, it offers a streamlined interface for sales teams to track customer interactions and improve conversion rates.

## Features

- **User Management**: Role-based access control with customizable permissions
- **Contact Management**: Track and manage all customer information in one place
- **Lead Tracking**: Generate, assign, and convert leads to deals
- **Deal Pipeline**: Visual deal stages and pipeline management
- **Dashboard & Analytics**: Real-time metrics and sales forecasting
- **Activity Logging**: Record all customer interactions and follow-ups
- **Multi-tenancy**: Built-in support for SaaS deployment with tenant isolation
- **Responsive UI**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **State Management**: React Query, React Hook Form
- **UI Components**: Radix UI, Shadcn
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT
- **Deployment**: Docker, Kubernetes
- **Payments**: Stripe Integration

## Project Structure

```
📦 innovcrm
 ┣ 📂 app                  # Next.js app directory structure
 ┃ ┣ 📂 (application)      # Protected application routes
 ┃ ┣ 📂 (landing)          # Public landing pages
 ┃ ┗ 📂 api                # API endpoints
 ┣ 📂 components           # React components organized by feature
 ┃ ┣ 📂 admin              # Admin panel components
 ┃ ┣ 📂 contacts           # Contact management components
 ┃ ┣ 📂 deals              # Deal components
 ┃ ┣ 📂 leads              # Lead management components
 ┃ ┗ 📂 ui                 # Reusable UI components
 ┣ 📂 hooks                # Custom React hooks
 ┣ 📂 infrastructure       # Kubernetes configuration
 ┣ 📂 lib                  # Utility functions and helpers
 ┣ 📂 model                # Data models
 ┣ 📂 public               # Static assets
 ┣ 📂 services             # Service layer for API communication
 ┣ 📂 types                # TypeScript type definitions
 ┣ 📜 Dockerfile           # Docker configuration
 ┣ 📜 docker-compose.yml   # Docker Compose for local development
 ┗ 📜 package.json         # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- MongoDB instance (local or Atlas)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/kanniyala/innovcrm.git
   cd innovcrm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/innovcrm
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PRO_PLAN_PRICE_ID=your_stripe_plan_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT authentication | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | For payments |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments |
| `STRIPE_PRO_PLAN_PRICE_ID` | Stripe price ID for pro plan | For subscriptions |

## Docker Deployment

### Building and running with Docker

1. Build the Docker image:
   ```bash
   docker build -t innovcrm:latest .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.production innovcrm:latest
   ```

### Using Docker Compose

1. Update the `docker-compose.yml` file with your environment variables or use an `.env` file.

2. Start the services:
   ```bash
   docker-compose up -d
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Kubernetes Deployment

This project includes Kubernetes configuration files in the `infrastructure` directory.

1. Create a Kubernetes secret for your environment variables:
   ```bash
   kubectl create secret generic innovcrm-secrets \
     --from-literal=mongodb-uri='your_mongodb_uri' \
     --from-literal=jwt-secret='your_jwt_secret' \
     --from-literal=stripe-publishable-key='your_stripe_publishable_key' \
     --from-literal=stripe-secret-key='your_stripe_secret_key' \
     --from-literal=stripe-pro-plan-price-id='your_stripe_plan_id'
   ```

2. Apply the Kubernetes configurations:
   ```bash
   kubectl apply -f infrastructure/
   ```

3. Check the deployment status:
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

## Production Deployment

Before deploying to production:

1. Update the `next.config.js` file to configure production settings.
2. Ensure all environment variables are securely set in your hosting environment.
3. Consider implementing a CI/CD pipeline for automated deployments.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.