//use cdk to create a stack for the app
import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Lambda function for Hono API
    const honoLambda = new nodejs.NodejsFunction(this, 'HonoApiLambda', {
      entry: '../src/lambda.ts', // Path from infra directory to src
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      memorySize: 512,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL || '',
        NODE_ENV: 'production',
      },
      bundling: {
        externalModules: ['@aws-sdk/*'], // AWS SDK is available in Lambda runtime
        minify: true,
        sourceMap: true,
      },
    });

    // API Gateway for the Hono Lambda
    const api = new apigateway.LambdaRestApi(this, 'HonoApi', {
      handler: honoLambda,
      proxy: true, // Forward all requests to Lambda
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // S3 bucket for frontend static files
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: this.node.tryGetContext('destroy') ? 
        RemovalPolicy.DESTROY : 
        RemovalPolicy.RETAIN,
    });

    // Deploy frontend build to S3 (uncomment when ready)
    // const frontendDeployment = new s3deploy.BucketDeployment(this, 'FrontendDeployment', {
    //   sources: [s3deploy.Source.asset('../frontend/dist')],
    //   destinationBucket: frontendBucket,
    // });

    // Output the API URL
    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Hono API Gateway URL',
    });

    // Output the frontend bucket URL
    new CfnOutput(this, 'FrontendUrl', {
      value: frontendBucket.bucketWebsiteUrl,
      description: 'Frontend S3 Website URL',
    });
  }
}