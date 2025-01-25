"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ResultBlockProps {
  content?: string;
  type: "image" | "code";
  imageResultType?: "create-agent" | "image-gen" | null | string;
  language?: string;
  processing?: boolean;
  onMintNFT?: (content: string) => void;
  onDownloadProof?: () => void;
  onLaunchMemeCoin?: () => void;
  loading?: boolean;
}

const ResultBlock: React.FC<ResultBlockProps> = ({
  content,
  type,
  imageResultType,
  language,
  onMintNFT,
  onDownloadProof,
  onLaunchMemeCoin,
  loading,
  processing = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const copyToClipboard = () => {
    if (!content) {
      console.warn("No content to copy.");
      return;
    }
    const codeWithoutLanguage = content.split("\n").slice(1).join("\n");
    navigator.clipboard.writeText(codeWithoutLanguage).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg my-2 w-full p-4 md:p-6 max-w-[85vw] md:max-w-lg">
      {type === "image" ? (
        <div>
          {/* Buttons Section */}
          <div className="mt-2 flex flex-wrap gap-2 md:gap-4 justify-between mb-4">
            {onDownloadProof && (
              <button
                onClick={onDownloadProof}
                className="flex items-center space-x-1 md:space-x-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                disabled={processing}
              >
                <span className="text-[#A0AEC0] hover:text-[#00FF89] font-abeezee text-sm md:text-base">
                  Download Proof
                </span>
                <Image
                  src="images/downloadProof.svg"
                  alt="Download Proof"
                  width={20}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            )}
            {imageResultType === "create-agent" && onLaunchMemeCoin && (
              <button
                onClick={onLaunchMemeCoin}
                className="flex items-center space-x-1 md:space-x-2 text-white rounded whitespace-nowrap"
                disabled={processing}
              >
                <span className="text-[#A0AEC0] hover:text-[#00FF89] font-abeezee text-sm md:text-base">
                  Launch Agent
                </span>
                <Image
                  src="images/meme.svg"
                  alt="launch"
                  width={20}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            )}
            {imageResultType === "image-gen" && onMintNFT && (
              <button
                type="button"
                onClick={() => onMintNFT(`data:image/jpeg;base64,${content}`)}
                disabled={loading || processing}
                className="flex items-center space-x-1 md:space-x-2 rounded text-[#A0AEC0] hover:text-[#00FF89] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span className="font-abeezee text-sm md:text-base">
                  Mint NFT
                </span>
                <Image
                  src="images/nft.svg"
                  alt="Mint NFT"
                  width={20}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            )}
          </div>

          {/* Image Section */}
          <div className="relative min-h-[200px] md:min-h-80 rounded-lg bg-gray-700 flex overflow-hidden">
            {processing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75">
                <p className="text-gray-400 text-sm md:text-base px-4 text-center">
                  Processing... This may take up to 5 minutes.
                </p>
                <span className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-white mt-4"></span>
              </div>
            ) : !loading ? (
              <div className="relative min-h-[200px] md:min-h-64 rounded-lg bg-gray-700 flex overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${content}`}
                  alt="Generated content"
                  className="rounded-lg w-full h-full object-cover"
                />
                {loading && (
                  <div
                    className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center"
                    role="status"
                    aria-label="Minting NFT"
                  >
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin mb-2" />
                    <span className="text-white text-base md:text-lg font-semibold">
                      Minting NFT...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={content ? `data:image/jpeg;base64,${content}` : ""}
                alt="Generated content"
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 justify-between mb-1">
            <button
              onClick={onDownloadProof}
              className="flex items-center space-x-1 md:space-x-2 text-white rounded whitespace-nowrap"
            >
              <span className="text-[#A0AEC0] text-sm md:text-base">
                Download Proof
              </span>
              <Image
                src="images/downloadProof.svg"
                alt="Download Proof"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 md:space-x-2 text-[#A0AEC0] rounded whitespace-nowrap"
            >
              <span className="text-sm md:text-base">
                {isCopied ? "Copied!" : "Copy Code"}
              </span>
              <Image
                src="images/Copy.svg"
                alt="Copy Code"
                width={24}
                height={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </button>
          </div>
          {language && (
            <div className="text-xs md:text-sm text-gray-400 mb-1">
              {language}
            </div>
          )}
          <pre className="bg-gray-900 p-3 md:p-4 rounded-lg max-w-full overflow-x-auto whitespace-pre-wrap text-sm md:text-base">
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResultBlock;
