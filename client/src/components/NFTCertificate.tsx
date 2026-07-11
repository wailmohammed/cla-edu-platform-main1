import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Award, Share2, Download, ExternalLink, Zap } from "lucide-react";
import { toast } from "sonner";

interface NFTCertificateProps {
  courseId: number;
  courseName: string;
  completedDate: Date;
}

export default function NFTCertificate({
  courseId,
  courseName,
  completedDate,
}: NFTCertificateProps) {
  const [nftData, setNftData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = trpc.enhancements.nftCertificates.generateNFTCertificate.useMutation();

  const handleGenerateNFT = async (certificateType: "completion" | "achievement" | "mastery") => {
    try {
      setIsGenerating(true);
      const result = await generateMutation.mutateAsync({
        courseId,
        certificateType,
      });
      setNftData(result);
      toast.success("NFT Certificate generated!");
    } catch (error) {
      toast.error("Failed to generate NFT certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = (platform: string) => {
    const text = `I just completed ${courseName} on Codelearnify and earned an NFT certificate! 🎓`;
    const url = nftData?.contractAddress || "https://learncode.io";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
    }
    toast.success(`Shared on ${platform}!`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              NFT Certificate
            </CardTitle>
            <CardDescription>Blockchain-verified achievement</CardDescription>
          </div>
          <Badge variant="outline" className="bg-yellow-50">
            Web3
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {!nftData ? (
          <>
            {/* Certificate Preview */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center">
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">{courseName}</h3>
              <p className="text-sm text-slate-600 mb-3">
                Completed on {completedDate.toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-500">
                Mint this achievement as an NFT on the blockchain
              </p>
            </div>

            {/* Certificate Type Selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Select Certificate Type:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleGenerateNFT("completion")}
                  disabled={isGenerating}
                  variant="outline"
                  className="justify-start"
                >
                  <Zap className="w-4 h-4 mr-2 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Completion</p>
                    <p className="text-xs text-slate-500">Basic achievement</p>
                  </div>
                </Button>
                <Button
                  onClick={() => handleGenerateNFT("achievement")}
                  disabled={isGenerating}
                  variant="outline"
                  className="justify-start"
                >
                  <Zap className="w-4 h-4 mr-2 text-purple-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Achievement</p>
                    <p className="text-xs text-slate-500">Rare milestone</p>
                  </div>
                </Button>
                <Button
                  onClick={() => handleGenerateNFT("mastery")}
                  disabled={isGenerating}
                  variant="outline"
                  className="justify-start"
                >
                  <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Mastery</p>
                    <p className="text-xs text-slate-500">Expert level</p>
                  </div>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* NFT Generated */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-slate-900 mb-1">NFT Minted!</h3>
              <p className="text-xs text-slate-600 mb-3 font-mono break-all">
                {nftData.nftId}
              </p>
              <Badge className="bg-green-600">Verified on Blockchain</Badge>
            </div>

            {/* NFT Details */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-md">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Contract:</span>
                <code className="text-xs bg-slate-200 px-2 py-1 rounded">
                  {nftData.contractAddress?.substring(0, 12)}...
                </code>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Transaction:</span>
                <code className="text-xs bg-slate-200 px-2 py-1 rounded">
                  {nftData.transactionHash?.substring(0, 12)}...
                </code>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() =>
                  window.open(`https://etherscan.io/tx/${nftData.transactionHash}`, "_blank")
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Blockchain
              </Button>
              <Button variant="outline" className="w-full justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </div>

            {/* Share Options */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700">Share Your Achievement:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleShare("twitter")}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  𝕏
                </Button>
                <Button
                  onClick={() => handleShare("linkedin")}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  in
                </Button>
                <Button
                  onClick={() => handleShare("facebook")}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  f
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
