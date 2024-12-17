'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsProcessing(true);
      
      // Simulate file processing - we'll replace this with real processing later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to visualization page
      router.push('/visualization');
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'text/markdown': ['.md']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Para<span className="text-indigo-400">Graph</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Transform your Unstructured Meetings into Measurable Knowledge
            </p>
          </motion.div>

          {/* Upload Box */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
                ${isDragActive 
                  ? 'border-indigo-400 bg-indigo-500/10' 
                  : 'border-slate-700 hover:border-indigo-500/50 bg-slate-800/50'}
                ${isProcessing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                backdrop-blur-sm group`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-4">
                {isProcessing ? (
                  // Processing state
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                    <p className="text-lg text-indigo-300">Processing your file...</p>
                  </div>
                ) : (
                  // Upload state
                  <>
                    <div className={`p-4 rounded-full 
                      ${isDragActive ? 'bg-indigo-500/20' : 'bg-slate-700/20'}
                      group-hover:bg-indigo-500/20 transition-all duration-300`}
                    >
                      <svg 
                        className={`w-8 h-8 ${
                          isDragActive ? 'text-indigo-400' : 'text-slate-400'
                        } group-hover:text-indigo-400 transition-colors`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-slate-300 mb-2">
                        {isDragActive 
                          ? "Drop your file here" 
                          : "Drag & drop your recording or transcript"}
                      </p>
                      <p className="text-sm text-slate-400">
                        Supported formats: MP3, WAV, M4A, TXT, JSON, MD
                      </p>
                    </div>
                    {!isDragActive && (
                      <button className="mt-4 px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30
                        text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-500/50
                        transition-all duration-200">
                        Browse Files
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* File Preview */}
            {file && !isProcessing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-300 font-medium">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}