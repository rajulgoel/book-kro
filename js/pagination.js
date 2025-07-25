function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    let pages = [];
    
    // Add "First" button if not on first page
    if (currentPage > 1) {
        pages.push(`
            <button 
                class="pagination-btn px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                data-page="1"
                aria-label="Go to first page"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                </svg>
            </button>
        `);
        
        pages.push(`
            <button 
                class="pagination-btn px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors" 
                data-page="${currentPage - 1}"
                aria-label="Go to previous page"
            >
                Previous
            </button>
        `);
    }
    
    // Add ellipsis if needed
    if (startPage > 1) {
        pages.push(`
            <span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
        `);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        pages.push(`
            <button 
                class="pagination-btn px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActive 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }" 
                data-page="${i}"
                ${isActive ? 'disabled aria-current="page"' : ''}
                aria-label="Go to page ${i}"
            >
                ${i}
            </button>
        `);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages) {
        pages.push(`
            <span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
        `);
    }
    
    // Add "Next" and "Last" buttons if not on last page
    if (currentPage < totalPages) {
        pages.push(`
            <button 
                class="pagination-btn px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors" 
                data-page="${currentPage + 1}"
                aria-label="Go to next page"
            >
                Next
            </button>
        `);
        
        pages.push(`
            <button 
                class="pagination-btn px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors" 
                data-page="${totalPages}"
                aria-label="Go to last page"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
            </button>
        `);
    }
    
    return `
        <div class="flex flex-col items-center space-y-4 mt-8">
            <!-- Page numbers -->
            <div class="flex flex-wrap justify-center items-center gap-2">
                ${pages.join('')}
            </div>
            
            <!-- Page info -->
            <div class="text-sm text-gray-600 dark:text-gray-400 text-center">
                <span class="hidden sm:inline">Showing page</span>
                <span class="font-medium text-blue-600 dark:text-blue-400">${currentPage}</span>
                <span class="hidden sm:inline">of</span>
                <span class="sm:hidden">/</span>
                <span class="font-medium">${totalPages}</span>
                <span class="hidden sm:inline">pages</span>
            </div>
            
            <!-- Quick jump (for large page counts) -->
            ${totalPages > 10 ? `
                <div class="flex items-center space-x-2 text-sm">
                    <label for="page-jump" class="text-gray-600 dark:text-gray-400">Jump to:</label>
                    <input 
                        type="number" 
                        id="page-jump" 
                        min="1" 
                        max="${totalPages}" 
                        value="${currentPage}"
                        class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <button 
                        id="jump-btn" 
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                        Go
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function setupPaginationEvents(currentPage, totalPages, onPageChange) {
    // Handle pagination button clicks
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(btn.dataset.page);
            
            if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                // Add loading state
                btn.disabled = true;
                btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Load new page
                onPageChange(page).finally(() => {
                    // Re-enable button (it will be replaced by new pagination)
                    btn.disabled = false;
                });
            }
        });
    });
    
    // Handle quick jump functionality
    const jumpInput = document.getElementById('page-jump');
    const jumpBtn = document.getElementById('jump-btn');
    
    if (jumpInput && jumpBtn) {
        const handleJump = () => {
            const page = parseInt(jumpInput.value);
            
            if (page && page >= 1 && page <= totalPages && page !== currentPage) {
                jumpBtn.disabled = true;
                jumpBtn.textContent = 'Loading...';
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onPageChange(page).finally(() => {
                    jumpBtn.disabled = false;
                    jumpBtn.textContent = 'Go';
                });
            } else {
                jumpInput.value = currentPage;

            }
        };
        
        jumpBtn.addEventListener('click', handleJump);
        
        jumpInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleJump();
            }
        });
        
        jumpInput.addEventListener('blur', () => {
            const page = parseInt(jumpInput.value);
            if (!page || page < 1 || page > totalPages) {
                jumpInput.value = currentPage;
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handlePaginationKeyboard);
}

function handlePaginationKeyboard(e) {
    // Only handle if no input is focused
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    const paginationContainer = document.querySelector('[data-page]')?.parentElement;
    if (!paginationContainer) return;
    
    const currentPageBtn = paginationContainer.querySelector('[aria-current="page"]');
    if (!currentPageBtn) return;
    
    const currentPage = parseInt(currentPageBtn.dataset.page);
    const allPageBtns = Array.from(paginationContainer.querySelectorAll('[data-page]'));
    const totalPages = Math.max(...allPageBtns.map(btn => parseInt(btn.dataset.page)));
    
    let targetPage = null;
    
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPage > 1) {
                targetPage = currentPage - 1;
                e.preventDefault();
            }
            break;
        case 'ArrowRight':
            if (currentPage < totalPages) {
                targetPage = currentPage + 1;
                e.preventDefault();
            }
            break;
        case 'Home':
            if (currentPage > 1) {
                targetPage = 1;
                e.preventDefault();
            }
            break;
        case 'End':
            if (currentPage < totalPages) {
                targetPage = totalPages;
                e.preventDefault();
            }
            break;
    }
    
    if (targetPage) {
        const targetBtn = paginationContainer.querySelector(`[data-page="${targetPage}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

// Enhanced pagination with smooth transitions
function createLoadingPagination() {
    return `
        <div class="flex justify-center items-center mt-8">
            <div class="flex space-x-2">
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
        </div>
    `;
}

// Add pagination styles
const paginationStyles = document.createElement('style');
paginationStyles.textContent = `
    .pagination-btn:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
    
    .pagination-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .pagination-btn:active:not(:disabled) {
        transform: translateY(0);
    }
    
    @media (max-width: 640px) {
        .pagination-btn {
            min-width: 40px;
            padding: 8px 12px;
        }
    }
    
    /* Smooth page transitions */
    #movie-grid {
        transition: opacity 0.3s ease-in-out;
    }
    
    #movie-grid.loading {
        opacity: 0.5;
    }
`;
document.head.appendChild(paginationStyles);

// Remove keyboard event listener when not needed
function cleanupPaginationEvents() {
    document.removeEventListener('keydown', handlePaginationKeyboard);
}