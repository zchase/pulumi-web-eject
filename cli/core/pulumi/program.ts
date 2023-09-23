import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";
import * as path from "path";

export async function installPlugins(stack: pulumi.automation.Stack) {
    await stack.workspace.installPlugin("aws", "v6.2.1");
    await stack.workspace.installPlugin("synced-folder", "v0.11.1");
}

interface ProgramOutputs {
    originURL: pulumi.Output<string>;
    originHostname: pulumi.Output<string>;
    cdnURL?: pulumi.Output<string>;
    cdnHostname?: pulumi.Output<string>;
}

const contentPath = path.join(process.cwd(), "build");

export function websiteProgram(): ProgramOutputs {
    // Create an S3 bucket and configure it as a website.
    const bucket = new aws.s3.Bucket("bucket", {
        website: {
            indexDocument: "index.html",
            errorDocument: "404.html",
        },
    });

    // Configure ownership controls for the new S3 bucket
    const ownershipControls = new aws.s3.BucketOwnershipControls("ownership-controls", {
        bucket: bucket.bucket,
        rule: {
            objectOwnership: "ObjectWriter",
        },
    });

    // Configure public ACL block on the new S3 bucket
    const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
        bucket: bucket.bucket,
        blockPublicAcls: false,
    });

    // Use a synced folder to manage the files of the website.
    new synced_folder.S3BucketFolder("bucket-folder", {
        path: contentPath,
        bucketName: bucket.bucket,
        acl: "public-read",
        managedObjects: false,
    }, { dependsOn: [ownershipControls, publicAccessBlock]});

    // Create a CloudFront CDN to distribute and cache the website.
    // const cdn = new aws.cloudfront.Distribution("cdn", {
    //     enabled: true,
    //     origins: [{
    //         originId: bucket.arn,
    //         domainName: bucket.websiteEndpoint,
    //         customOriginConfig: {
    //             originProtocolPolicy: "http-only",
    //             httpPort: 80,
    //             httpsPort: 443,
    //             originSslProtocols: ["TLSv1.2"],
    //         },
    //     }],
    //     defaultCacheBehavior: {
    //         targetOriginId: bucket.arn,
    //         viewerProtocolPolicy: "redirect-to-https",
    //         allowedMethods: [
    //             "GET",
    //             "HEAD",
    //             "OPTIONS",
    //         ],
    //         cachedMethods: [
    //             "GET",
    //             "HEAD",
    //             "OPTIONS",
    //         ],
    //         defaultTtl: 600,
    //         maxTtl: 600,
    //         minTtl: 600,
    //         forwardedValues: {
    //             queryString: true,
    //             cookies: {
    //                 forward: "all",
    //             },
    //         },
    //     },
    //     priceClass: "PriceClass_100",
    //     customErrorResponses: [{
    //         errorCode: 404,
    //         responseCode: 404,
    //         responsePagePath: `/404.html`,
    //     }],
    //     restrictions: {
    //         geoRestriction: {
    //             restrictionType: "none",
    //         },
    //     },
    //     viewerCertificate: {
    //         cloudfrontDefaultCertificate: true,
    //     },
    // });

    return {
        originURL: pulumi.interpolate`http://${bucket.websiteEndpoint}`,
        originHostname: bucket.websiteEndpoint,
        // cdnURL: pulumi.interpolate`https://${cdn.domainName}`,
        // cdnHostname: cdn.domainName,
    };
}

// createEjectableProgram creates the actual program.
export function createEjectableProgram(): string {
    return `import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";
import * as path from "path";

const contentPath = path.join(process.cwd(), "..", "build");

${websiteProgram.toString()}

export const { originURL, originHostname } = websiteProgram();
`;
}

// createPulumiYamlString creates the Pulumi.yaml file for the project. This is
// used for ejecting the program.
export function createPulumiYamlString(projectName: string, description: string) {
    return `name: ${projectName}
description: ${description}
runtime: nodejs`;
}
