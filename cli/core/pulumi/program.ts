import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

interface ProgramOutputs {
    websiteUrl: pulumi.Output<string>;
}

export async function websiteProgram(): Promise<ProgramOutputs> {
    const bucket = new aws.s3.Bucket("my-bucket", {
        website: {
            indexDocument: "index.html",
        },
    });

    return {
        websiteUrl: bucket.websiteEndpoint,
    };
}

export function createEjectableProgram(): string {
    return `import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

${websiteProgram.toString()}

export const outputs = websiteProgram();
`;
}
