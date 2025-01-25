import React, { ChangeEvent, FormEvent, RefObject } from "react";
import Image from "next/image";
import { BsArrowReturnLeft } from "react-icons/bs";
import CommandPopup from "@/component/ui/CommandPopup"; // Assuming the component is in the same directory
import { Command, TickerPopup } from "./HomeContent"; // Assuming the component is in the same directory

interface FilePreview {
  isPdf: boolean;
  isVideoOrAudio?: boolean;
  file: File;
  preview: string;
}

interface FooterProps {
  files: FilePreview[];
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputMessage: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  wallet: { connected: boolean };
  showCommandPopup: boolean;
  commandPopupRef: RefObject<HTMLDivElement>;
  handleCommandSelect: (command: Command) => void;
  showTickerPopup: boolean;
  tickers: string[];
  handleTickerSelect: (ticker: string) => void;
  isLoading: boolean;
  isMobile: boolean;
  isMenuOpen?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  files,
  handleSubmit,
  handleFileChange,
  removeFile,
  inputRef,
  inputMessage,
  handleInputChange,
  wallet,
  showCommandPopup,
  commandPopupRef,
  handleCommandSelect,
  showTickerPopup,
  tickers,
  handleTickerSelect,
  isLoading,
  isMobile,
  isMenuOpen,
}) => {
  return (
    <footer
      className={`fixed bottom-0 py-6 flex flex-grow justify-center bg-[#08121f]/80 backdrop-blur-sm ${
        isMobile
          ? isMenuOpen
            ? "right-0 w-[55%]" // Mobile with menu open
            : "right-0 w-full" // Mobile with menu closed
          : "right-0 ml-64 w-[calc(100%-16rem)]" // Desktop view
      } rounded-tl-3xl`}
    >
      <div
        className={`bg-gradient-to-tr from-[#000D33]/90 via-[#9A9A9A]/20 to-[#000D33]/90 p-0.5 rounded-lg ${
          isMobile ? "w-[650px] max-w-[calc(100%-1rem)]" : "w-[650px]"
        } mx-auto`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col bg-[#08121f] rounded-lg"
        >
          {files.length > 0 && (
            // <div className="flex flex-wrap gap-2 p-2">
            //     {files.map((file, index) => (
            //         <div key={index} className="relative w-20 h-20">
            //             {file.isPdf ? (
            //                 <div className="w-full h-full flex items-center justify-center bg-[#24284E] rounded-lg text-xs text-[#BDA0FF] text-center overflow-hidden p-1 border border-[#BDA0FF]">
            //                     {file.file.name}
            //                 </div>
            //             ) : (
            //                 <Image
            //                     src={file.preview}
            //                     alt={`Preview ${index}`}
            //                     width={500}
            //                     height={500}
            //                     className="w-full h-full object-cover rounded-lg"
            //                     layout="responsive"
            //                 />
            //             )}
            //             <button
            //                 onClick={() => removeFile(index)}
            //                 className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            //                 type="button"
            //             >
            //                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            //                     <line x1="18" y1="6" x2="6" y2="18"></line>
            //                     <line x1="6" y1="6" x2="18" y2="18"></line>
            //                 </svg>
            //             </button>
            //         </div>
            //     ))}
            // </div>
            <div className="flex flex-wrap gap-2 p-2">
              {files.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  {file.isPdf ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-white rounded-lg">
                      {file.file.name}
                    </div>
                  ) : file.isVideoOrAudio ? (
                    <div className="w-full h-full">
                      {file.file.type.startsWith("video/") ? (
                        <video
                          src={file.preview}
                          controls
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <audio
                          src={file.preview}
                          controls
                          className="w-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={file.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    type="button"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,video/*,audio/*"
              className="hidden"
              id="fileInput"
              multiple
              disabled={!wallet.connected}
            />
            <label
              htmlFor="fileInput"
              className={`flex items-center justify-center bg-[#08121f] text-white rounded-lg px-3 py-2 ${
                !wallet.connected
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{
                height: "2.5rem",
              }}
            >
              <Image
                src="/images/Attach.svg"
                alt="Attach file"
                width={20}
                height={20}
              />
            </label>

            <div className="relative w-full flex items-center bg-transparent py-1 mt-2 px-4 rounded-l-full absolute">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (inputMessage.trim() !== "") {
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }
                  }
                }}
                placeholder="Message ZkTerminal"
                className="w-full resize-none overflow-y-auto bg-[#08121f] text-white rounded-lg placeholder-[#A0AEC0] focus:outline-none  custom-scrollbar"
                style={{
                  lineHeight: "1.5",
                  height: "2.5rem",
                  maxHeight: "10rem",
                  boxSizing: "border-box",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "2.5rem";
                  target.style.height = `${Math.min(
                    target.scrollHeight,
                    160
                  )}px`;
                }}
                disabled={!wallet.connected}
              />
              {showCommandPopup && (
                <div ref={commandPopupRef}>
                  <CommandPopup onSelect={handleCommandSelect} />
                </div>
              )}
              {showTickerPopup && (
                <TickerPopup tickers={tickers} onSelect={handleTickerSelect} />
              )}
            </div>

            <button
              type="submit"
              data-action="sendMessage"
              className={`p-1 m-1 rounded-md font-bold ${
                inputMessage.trim() === ""
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-white text-black"
              }`}
              style={{
                height: "1.5rem",
              }}
              disabled={
                isLoading || !wallet.connected || inputMessage.trim() === ""
              }
            >
              <BsArrowReturnLeft />
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
