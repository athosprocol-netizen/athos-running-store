
import React from 'react';
import { ChevronRight, Home, Package } from 'lucide-react';

// --- BREADCRUMBS ---
interface BreadcrumbProps {
    items: { label: string; action?: () => void }[];
}

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wide text-gray-400 mb-6 animate-fade-in">
            <button className="hover:text-athos-orange transition-colors">
                <Home size={12} />
            </button>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={10} />
                    <button 
                        onClick={item.action} 
                        disabled={!item.action}
                        className={`${!item.action ? 'text-athos-black cursor-default' : 'hover:text-athos-orange transition-colors cursor-pointer'}`}
                    >
                        {item.label}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

// --- PAGINATION ---
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8 animate-fade-in">
            <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-athos-black hover:text-athos-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16} className="rotate-180"/>
            </button>
            
            <span className="text-xs font-black uppercase tracking-widest text-athos-black px-4">
                Página {currentPage} de {totalPages}
            </span>

            <button 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-athos-black hover:text-athos-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

// --- SKELETON LOADER ---
export const ProductSkeleton = () => {
    return (
        <div className="bg-white p-4 rounded-[24px] animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-end">
                <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
            </div>
        </div>
    );
};

// --- STOCK INDICATOR ---
export const StockIndicator = ({ stock }: { stock: number }) => {
    if (stock === 0) {
        return <span className="text-xs font-bold text-red-500 flex items-center gap-1"><Package size={12}/> Agotado</span>;
    }
    if (stock < 5) {
        return <span className="text-xs font-bold text-athos-orange flex items-center gap-1 animate-pulse"><Package size={12}/> ¡Solo quedan {stock}!</span>;
    }
    return <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Package size={12}/> En Stock</span>;
};
