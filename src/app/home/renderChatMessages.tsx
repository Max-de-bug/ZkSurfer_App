import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ResultBlock from "@/component/ui/ResultBlock"; // Import the ResultBlock component
import { Message } from "./HomeContent";
import { ChevronUp, ChevronDown } from "lucide-react";

interface RenderChatMessagesProps {
  displayMessages: Array<Message>;
  isLoading: boolean;
  processingCommand: boolean;
  handleMintNFT: (base64Image: string) => Promise<void>;
  handleDownload: () => void;
  renderMessageContent: (
    message: Message
  ) => JSX.Element | JSX.Element[] | null;
  imageResultType: string | null;
  handleLaunchMemeCoin: () => void;
  isMobile: boolean;
}

const RenderChatMessages: React.FC<RenderChatMessagesProps> = ({
  displayMessages,
  isLoading,
  processingCommand,
  handleMintNFT,
  handleDownload,
  renderMessageContent,
  imageResultType,
  handleLaunchMemeCoin,
  isMobile,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const shouldShowExpand = (message: Message) => {
    if (typeof message.content === "string") {
      return message.content.length > 200;
    }
    return false;
  };

  return (
    <div className="pb-32">
      {" "}
      {/* Add padding at bottom to prevent messages from being hidden behind footer */}
      {/* Render chat messages */}
      {displayMessages.map((message: Message, index) => (
        <div
          key={index}
          className={`mb-4 flex justify-end content-end w-full group hover:bg-gray-900/50 transition-colors duration-200 rounded-lg ${
            isMobile ? "px-2" : "px-4"
          }`}
        >
          <div
            className={cn("mb-4 flex w-full py-2", {
              "justify-end": message.role === "user",
              "justify-start": message.role !== "user",
              "px-2": isMobile,
              "px-4": !isMobile,
            })}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 ${isMobile ? "mr-2" : "mr-3"}`}>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#171D3D] border flex items-center justify-center">
                {message.role === "user" ? (
                  <span className="text-sm md:text-base">U</span>
                ) : (
                  <Image
                    src="images/tiger.svg"
                    alt="logo"
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                    className="p-2"
                  />
                )}
              </div>
            </div>

            {/* Message Content */}
            <div
              className={`flex flex-col items-start ${
                isMobile ? "max-w-[85%]" : "max-w-[450px]"
              }`}
            >
              <div className="flex items-center justify-between w-full mt-2">
                <span
                  className={`text-sm md:text-md text-gray-400 font-sourceCode ${
                    message.role !== "user" &&
                    "bg-gradient-to-br from-zkIndigo via-zkLightPurple to-zkPurple bg-clip-text text-transparent"
                  }`}
                >
                  {message.role === "user" ? "User" : "ZkTerminal"}
                </span>

                {/* Action buttons */}
                {message.role === "assistant" && (
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="text-white rounded-lg hover:bg-gray-700 p-1">
                      <Image
                        src="images/Download.svg"
                        alt="download"
                        width={isMobile ? 16 : 20}
                        height={isMobile ? 16 : 20}
                      />
                    </button>
                    <button className="text-white rounded-lg hover:bg-gray-700 p-1">
                      <Image
                        src="images/share.svg"
                        alt="share"
                        width={isMobile ? 16 : 20}
                        height={isMobile ? 16 : 20}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Message Content */}
              {message.role === "assistant" &&
              typeof message.content === "string" &&
              message.content.startsWith("/") ? (
                <ResultBlock
                  content={message.content}
                  type="image"
                  onMintNFT={handleMintNFT}
                  onDownloadProof={handleDownload}
                  imageResultType={message.command}
                  onLaunchMemeCoin={
                    message.command === "create-agent"
                      ? handleLaunchMemeCoin
                      : undefined
                  }
                  loading={isLoading}
                />
              ) : (
                <div
                  className={`inline-block mt-1 p-4 md:p-5 bg-gray-800 rounded-lg text-white ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  <div className="flex flex-row">
                    {typeof message.content === "string" ? (
                      <>
                        <p
                          className={
                            expandedIndex !== index ? "line-clamp-3" : ""
                          }
                        >
                          {renderMessageContent(message)}
                        </p>
                        {shouldShowExpand(message) && (
                          <span>
                            <button
                              className="text-blue-500 ml-2 hover:bg-white hover:bg-opacity-10 rounded-full px-3 py-3 transition"
                              onClick={() => handleToggleExpand(index)}
                            >
                              {expandedIndex === index ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </span>
                        )}
                      </>
                    ) : (
                      renderMessageContent(message)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {isLoading &&
        (processingCommand ? (
          <div className="mb-4 flex w-full justify-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-[#171D3D] border flex items-center justify-center">
                <Image
                  src="images/tiger.svg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="p-2"
                />
              </div>
            </div>
            <div className="flex flex-col items-start w-full h-full">
              <div className="flex items-center justify-between w-full mt-2">
                <span className="flex justify-between items-center text-md text-gray-400 font-sourceCode bg-gradient-to-br from-zkIndigo via-zkLightPurple to-zkPurple bg-clip-text text-transparent">
                  ZkTerminal
                </span>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                <ResultBlock
                  type="image"
                  processing={true}
                  onDownloadProof={handleDownload}
                  imageResultType={imageResultType}
                  onMintNFT={handleMintNFT}
                  onLaunchMemeCoin={handleLaunchMemeCoin}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
            <p>Processing your query. This may take up to 5 minutes...</p>
          </div>
        ))}
    </div>
  );
};

export default RenderChatMessages;
