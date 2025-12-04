import { FilterProps } from '@/types'

export const Filter: React.FC<FilterProps> = ({filter, handleFilterChange, sort, setSort}) => {
  return (
    
      <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filter}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
              />
            </div>

            <button 
              onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
            >
              Ordenar por Precio ({sort === 'asc' ? '↑' : '↓'})
            </button>
      </div>
      
  )
}
