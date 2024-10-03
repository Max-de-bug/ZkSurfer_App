
'use client';
import { FC, useState, useEffect } from 'react';
import { BiMenuAltLeft, BiMenuAltRight } from 'react-icons/bi';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { FaPen } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import Image from 'next/image';
import createNft from '../../component/MintNFT';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import CodeBlock from '@/component/ui/CodeBlock';
import ResultBlock from '@/component/ui/ResultBlock';

interface Message {
    role: 'user' | 'assistant';
    content: string | Array<{
        type: 'text' | 'image_url';
        text?: string;
        image_url?: { url: string };
    }>;
    type?: 'text' | 'image' | 'image_url'; //| 'text-pdf' | 'text-image-pdf' | 'pdf' |
    proof?: any;
}

const HomeContent: FC = () => {
    const wallet = useWallet();
    const { data: session, status } = useSession();
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [proofData, setProofData] = useState(null);
    const [resultType, setResultType] = useState('');

    const [displayMessages, setDisplayMessages] = useState<Message[]>([]); // Array for messages to be displayed
    const [apiMessages, setApiMessages] = useState<Message[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (session && session.user && session.user.email) {
            setUserEmail(session.user.email);
        }
    }, [session]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileInput(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!inputMessage.trim() && !fileInput) return;

        let messageType: Message['type'] = 'text';
        // let messageContent = inputMessage.trim();


        let messageContent: any[] = [];

        // Add text content if present
        if (inputMessage.trim()) {
            messageContent.push({
                type: "text",
                text: inputMessage.trim()
            });
        }

        if (fileInput) {
            const reader = new FileReader();

            reader.onload = async (event) => {
                if (event.target) {
                    const fileContent = event.target.result as string;
                    console.log('fileContent', fileContent)

                    // Add image content
                    messageContent.push({
                        type: "image_url",
                        image_url: {
                            url: fileContent
                        }
                    });

                    const userMessage: Message = {
                        role: 'user',
                        content: messageContent
                    };

                    setDisplayMessages(prev => [...prev, userMessage]);
                    setApiMessages(prev => [...prev, userMessage]);

                    setInputMessage('');
                    setFileInput(null);
                    setIsLoading(true);

                    try {
                        const response = await fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                messages: [...apiMessages, userMessage],
                            }),
                        });

                        if (!response.ok) throw new Error('Failed to get response');

                        const data = await response.json();
                        setProofData(data.proof);

                        let assistantMessageForDisplay: Message;
                        let assistantMessageForAPI: Message;

                        if (data.type === 'image' || (typeof data.content === 'string' && data.content.startsWith('/'))) {
                            setResultType('image');
                            assistantMessageForDisplay = {
                                role: 'assistant',
                                content: data.content,
                                type: 'image'
                            };
                            assistantMessageForAPI = {
                                role: 'assistant',
                                content: data.prompt || data.content,
                                type: 'text'
                            };
                        } else {
                            assistantMessageForDisplay = {
                                role: 'assistant',
                                content: data.content,
                                type: 'text'
                            };
                            assistantMessageForAPI = assistantMessageForDisplay;
                        }

                        setDisplayMessages(prev => [...prev, assistantMessageForDisplay]);
                        setApiMessages(prev => [...prev, assistantMessageForAPI]);

                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        setIsLoading(false);
                    }
                }
            };
            reader.readAsDataURL(fileInput);
        }
        else {
            // Handle text-only messages
            const userMessage: Message = { role: 'user', content: inputMessage };

            // Update the displayMessages array
            setDisplayMessages((prev) => [...prev, userMessage]);

            // Update the apiMessages array
            const apiMessage: Message = { role: 'user', content: inputMessage };
            setApiMessages((prev) => [...prev, apiMessage]);

            setInputMessage('');
            setIsLoading(true);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            try {
                // Make the API call with the apiMessages array
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [...apiMessages, apiMessage], // Send only relevant API messages
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error('Failed to get response');

                const data = await response.json();
                console.log('api', data);

                let assistantMessageForDisplay: Message;
                let assistantMessageForAPI: Message;

                setProofData(data.proof);

                if (data.type === 'img') {
                    setResultType(data.type)
                    // If the data is of type 'img', set different content for display and API message
                    assistantMessageForDisplay = {
                        role: 'assistant',
                        content: data.content, // This will be the actual content (image or text) to display
                    };
                    assistantMessageForAPI = {
                        role: 'assistant',
                        content: data.prompt, // Message sent to API
                    };
                } else {
                    assistantMessageForDisplay = {
                        role: 'assistant',
                        content: data.content, // Display the actual content
                    };
                    assistantMessageForAPI = {
                        role: 'assistant',
                        content: data.content, // Send the actual content to API as well
                    };
                }

                // Update displayMessages with the actual content (including images)
                setDisplayMessages((prev) => [...prev, assistantMessageForDisplay]);

                // Update apiMessages with the API-friendly message
                setApiMessages((prev) => [...prev, assistantMessageForAPI]);

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    const menuItems = [
        'ZkSurfer',
        'Explore ZkSurfer',
        'Fill registration forms',
        'Create blog and registration forms',
        'Create top performing stock in Nifty 50',
    ];

    const [count, setCount] = useState(0);
    // const [nftResponse, setNftResponse] = useState<string | null>(null);  // Store the NFT response
    const [loading, setLoading] = useState(false);  // Loading state
    //both are hardcoded values
    const name = "car";
    const image = "0x1";


    const handleMintNFT = async (base64Image: string) => {
        setLoading(true);
        try {
            const { signature, assetPublicKey } = await createNft(wallet, base64Image, wallet.publicKey?.toString() || '');
            const metaplexUrl = `https://core.metaplex.com/explorer/${assetPublicKey}?env=devnet`;
            window.open(metaplexUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Failed to mint NFT:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!proofData) {
            console.log('No proof data to download');
            return;
        }

        let file: any;
        try {
            file = await (window as any).showSaveFilePicker({
                suggestedName: 'proof.json',
                types: [
                    {
                        description: 'JSON file',
                        accept: {
                            'application/json': ['.json'],
                        },
                    },
                ],
            });
        } catch {
            return console.log('User aborted file');
        }
        const writeStream = await file.createWritable();
        await writeStream.write(JSON.stringify(proofData, null, 4));
        await writeStream.close();
    };

    // const renderMessageContent = (message: Message) => {
    //     if (message.type === 'image' || message.content.startsWith('/')) {
    //         return (
    //             <ResultBlock
    //                 content={message.content}
    //                 type="image"
    //                 onMintNFT={handleMintNFT}
    //                 onDownloadProof={handleDownload}
    //             />
    //         );
    //     }
    //     // else if (message.type.includes('pdf')) {
    //     //     return <embed src={message.content} type="application/pdf" width="100%" height="600px" />;
    //     //} 
    //     else {
    //         // Handle text content
    //         const parts = message.content.split('```');
    //         return parts.map((part, index) => {
    //             if (index % 2 === 0) {
    //                 // Regular text
    //                 return (
    //                     <div key={index} className="mb-4">
    //                         {part.trim()}
    //                     </div>
    //                 );
    //             } else {
    //                 // Code block
    //                 return (
    //                     <ResultBlock
    //                         key={index}
    //                         content={part.trim().split('\n').slice(1).join('\n')}
    //                         language={part.trim().split('\n')[0]}
    //                         type="code"
    //                         onDownloadProof={handleDownload}
    //                     />
    //                 );
    //             }
    //         });
    //     }
    // };
    const renderMessageContent = (message: Message) => {
        if (Array.isArray(message.content)) {
            return message.content.map((content, index) => {
                if (content.type === 'text') {
                    return renderTextContent(content.text || '');
                } else if (content.type === 'image_url') {
                    return (
                        <ResultBlock
                            key={index}
                            content={content.image_url?.url || ''}
                            type="image"
                            onMintNFT={handleMintNFT}
                            onDownloadProof={handleDownload}
                        />
                    );
                }
                return null;
            });
        } else {
            // Handle the old string content structure
            if (message.type === 'image' || message.content.startsWith('/')) {
                return (
                    <ResultBlock
                        content={message.content}
                        type="image"
                        onMintNFT={handleMintNFT}
                        onDownloadProof={handleDownload}
                    />
                );
            } else {
                return renderTextContent(message.content);
            }
        }
    };

    const renderTextContent = (content: string) => {
        const parts = content.split('```');
        return parts.map((part, index) => {
            if (index % 2 === 0) {
                // This is regular text
                return (
                    <div key={index} className="mb-4">
                        {part.trim()}
                    </div>
                );
            } else {
                // This is a code block
                return (
                    <ResultBlock
                        key={index}
                        content={part.trim().split('\n').slice(1).join('\n')}
                        language={part.trim().split('\n')[0]}
                        type="code"
                        onDownloadProof={handleDownload}
                    />
                );
            }
        });
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar code remains the same */}

            <div
                className={`
                    ${isMobile ? (isMenuOpen ? 'block' : 'hidden') : 'block'} 
                    ${isMobile ? 'w-3/4' : 'w-64'} 
                    bg-[#08121f] h-screen overflow-y-auto fixed left-0 top-0 z-20
                `}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-10">
                        <div className="relative bg-gradient-to-tr from-[#000D33] via-[#9A9A9A] to-[#000D33] p-0.5 rounded-lg w-full mr-4">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-[#08121f] text-white p-2 rounded-lg"
                            />
                        </div>
                        {isMobile && (
                            <button onClick={toggleMenu} className="text-white flex justify-center items-center font-sourceCode">
                                <BiMenuAltRight size={32} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-4">ZkSurfer</div>
                        <div className="mb-4">Explore</div>
                    </div>
                    <Image
                        src="images/Line.svg"
                        alt="Welcome Line"
                        width={550}
                        height={50}
                        className='my-2'
                    />
                    <nav>
                        {/* <button onClick={handleMintNFT} disabled={loading}>
                            {loading ? 'Minting NFT...' : 'Mint NFT'}
                        </button> */}
                        {menuItems.map((item, index) => (
                            <div key={index} className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                                {item}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className={`flex-1 flex flex-col bg-[#08121f] ${!isMobile ? 'ml-64' : ''}`}>
                {/* Header code remains the same */}

                <header className="w-full py-4 bg-[#08121f] flex justify-between items-center px-4">
                    {isMobile && (
                        <button onClick={toggleMenu} className="text-white">
                            <BiMenuAltLeft size={28} />
                        </button>
                    )}
                    <div className="text-lg font-semibold flex-1 flex justify-center items-center gap-2">
                        <div><Image
                            src="images/tiger.svg"
                            alt="logo"
                            width={30}
                            height={30}
                        /></div>
                        <div className='font-ttfirs text-xl'>ZkSurfer</div>
                    </div>
                    <div className="flex space-x-4">
                        <button className="text-black bg-white p-1 rounded-lg"><FaPen /></button>
                        <button className="text-white"><HiDotsVertical /></button>
                    </div>
                </header>

                <Image
                    src="images/Line.svg"
                    alt="Welcome Line"
                    width={550}
                    height={50}
                    className={`my-2 ${!isMobile ? 'hidden' : 'visible'}`}
                />

                {/* Chat messages */}
                <div className="flex-grow overflow-y-auto px-4 py-8">
                    {displayMessages.map((message, index) => (
                        <div key={index} className="mb-4 flex justify-start w-full">
                            <div className="flex-shrink-0 mr-3">
                                <div className="w-10 h-10 rounded-full bg-[#171D3D] border flex items-center justify-center">
                                    {message.role === 'user' ? (
                                        userEmail.charAt(0).toUpperCase()
                                    ) : (
                                        <Image
                                            src="images/tiger.svg"
                                            alt="logo"
                                            width={40}
                                            height={40}
                                            className='p-2'
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center justify-between w-full mt-2">

                                    <span
                                        className={`flex justify-between items-center text-md text-gray-400 font-sourceCode ${message.role !== 'user' &&
                                            'bg-gradient-to-br from-zkIndigo via-zkLightPurple to-zkPurple bg-clip-text text-transparent'
                                            } ${!isMobile ? `mt-0.5` : ``}`}
                                    >
                                        {message.role === 'user' ? userEmail : 'ZkSurfer'}

                                    </span>
                                    {message.role !== 'user' && (
                                        <div className="flex space-x-2">
                                            <button className="text-white rounded-lg">
                                                <Image
                                                    src="images/Download.svg"
                                                    alt="logo"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                            <button className="text-white rounded-lg">
                                                <Image
                                                    src="images/share.svg"
                                                    alt="logo"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* {message.role === 'assistant' && (message.content.startsWith('/')) ? (
                                    <ResultBlock
                                        content={message.content.startsWith('/') ? message.content : message.content}
                                        type={message.content.startsWith('/') ? 'image' : 'code'}
                                        onMintNFT={message.content.startsWith('/') ? handleMintNFT : undefined}
                                        onDownloadProof={handleDownload}
                                    />
                                ) : (
                                    <div className="inline-block p-1 rounded-lg text-white">
                                        {renderMessageContent(message)}
                                    </div>
                                )} */}
                                {message.role === 'assistant' &&

                                    (typeof message.content === 'string' && message.content.startsWith('/')) ? (
                                    <ResultBlock
                                        content={message.content}
                                        type="image"
                                        onMintNFT={handleMintNFT}
                                        onDownloadProof={handleDownload}
                                    />
                                ) : (
                                    <div className="inline-block p-1 rounded-lg text-white">
                                        {renderMessageContent(message)}
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-center">
                            <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></span>
                        </div>
                    )}
                </div>


                <footer className="w-full py-4 flex justify-center px-4">
                    <div className={`bg-gradient-to-tr from-[#000D33] via-[#9A9A9A] to-[#000D33] p-0.5 rounded-lg ${!isMobile ? 'w-2/5' : 'w-full'}`}>
                        <form onSubmit={handleSubmit} className="w-full max-w-lg flex justify-center items-center bg-[#08121f] rounded-lg">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Message ZkSurfer"
                                className="bg-transparent flex-grow py-2 px-4 rounded-l-full outline-none text-white placeholder-[#A0AEC0] font-ttfirs"
                            />
                            <input
                                type="file"
                                onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                                accept="image/*"
                                className="hidden"
                                id="fileInput"
                            />
                            <label htmlFor="fileInput" className="cursor-pointer mx-2">
                                <Image
                                    src="/images/attachment.svg"
                                    alt="Attach file"
                                    width={20}
                                    height={20}
                                />
                            </label>
                            <button type="submit" className="bg-white text-black p-1 m-1 rounded-md font-bold" disabled={isLoading}>
                                <BsArrowReturnLeft />
                            </button>
                        </form>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomeContent;

