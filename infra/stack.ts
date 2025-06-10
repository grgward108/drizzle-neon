//use cdk to create a stack for the app
import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { config } from './env/parameters';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Lambda function for Hono API
    const honoLambda = new nodejs.NodejsFunction(this, 'HonoApiLambda', {
      entry: '../src/lambda.ts', // Path from infra directory to src
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: Duration.seconds(config.lambdaTimeout),
      memorySize: config.lambdaMemory,
      environment: {
        DATABASE_URL: config.databaseUrl,
        NODE_ENV: 'production',
      },
      bundling: {
        externalModules: ['@aws-sdk/*'], // AWS SDK is available in Lambda runtime
        minify: true,
        sourceMap: true,
      },
    });

    // S3 bucket for frontend static files
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: this.node.tryGetContext('destroy') ? 
        RemovalPolicy.DESTROY : 
        RemovalPolicy.RETAIN,
    });

    const frontendDeployment = new s3deploy.BucketDeployment(this, 'FrontendDeployment', {
      sources: [s3deploy.Source.asset('../frontend/dist')],
      destinationBucket: frontendBucket,
    });

    // API Gateway for the Hono Lambda
    const api = new apigatewayv2.HttpApi(this, 'HonoHttpApi', {
      defaultIntegration: new integrations.HttpLambdaIntegration('HonoIntegration', honoLambda),
      corsPreflight: {
        allowOrigins: [
          ...config.corsOrigins, // localhost origins from config
          frontendBucket.bucketWebsiteUrl, // Dynamic S3 website URL
        ],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Output the API URL
    new CfnOutput(this, 'ApiUrl', {
      value: api.apiEndpoint,
      description: 'Hono API Gateway URL',
    });

    // Output the frontend bucket URL
    new CfnOutput(this, 'FrontendUrl', {
      value: frontendBucket.bucketWebsiteUrl,
      description: 'Frontend S3 Website URL',
    });
  }
}