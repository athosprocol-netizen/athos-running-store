import React, { useEffect } from 'react';
import { useApp } from '../context';

export const Configurator = () => {
  const { setView } = useApp();
  
  // Effectively remove the view by redirecting immediately
  useEffect(() => {
    setView('shop');
  }, [setView]);

  return <div className="h-screen bg-athos-black flex items-center justify-center text-white">Redirecting...</div>;
};