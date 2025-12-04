// TODO: El candidato debe refactorizar este archivo.
// Es un Server Component por defecto en Next.js (app dir), pero está escrito como si fuera React viejo.
// Contiene: Bad Performance, Any types, Fetching waterfall, Logic coupling.

'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { getInitialData } from '../lib/mockData'
import { Loading } from '@/components/Loading'
import { Header } from '@/components/Header'
import { Filter } from '@/components/Filter'
import { Stats } from '@/components/Stats'
import { FilteredData } from '@/components/FilteredData'
import { ProductItem } from '@/types'
import { expensiveCalculation } from '@/helpers/expensiveCalculation'
import { useFilter } from '@/hooks/useFilter'

const LegacyDashboard = () => {
    const [data, setData] = useState<ProductItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState<string>('')
    const [debouncedFilter, setDebouncedFilter] = useState<string>('')
    const [sort, setSort] = useState<string>('asc')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 12
    
    // Cache para resultados de filtros
    const cacheRef = useRef<Map<string, ProductItem[]>>(new Map())
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  

    // Fetching de datos simulado
    useEffect(() => {
        setData(() => getInitialData(15000))
        setLoading(false)
    }, [])

    // Debounce del filtro (sin retrasos en el input)
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedFilter(filter.toLowerCase())
        }, 300) // 300ms de espera

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [filter])

    // Resetear paginación al filtrar o cambiar ordenamiento
    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedFilter, sort])

    // Función optimizada con cache
    const getCachedResult = useCallback((searchFilter: string, sortType: string) => {
        const cacheKey = `${searchFilter}|${sortType}`
        
        if (cacheRef.current.has(cacheKey)) {
            return cacheRef.current.get(cacheKey)!
        }

        const result = useFilter(data, sortType, searchFilter)
        cacheRef.current.set(cacheKey, result)
        
        // Limitar el tamaño del cache a 20 entradas
        if (cacheRef.current.size > 20) {
            const firstKey = cacheRef.current.keys().next().value
            if (firstKey) {
                cacheRef.current.delete(firstKey)
            }
        }

        return result
    }, [data])

    const result = useMemo(() => getCachedResult(debouncedFilter, sort), [debouncedFilter, sort, getCachedResult])

    const processed = useMemo(() => expensiveCalculation(result), [result])

    const totalItems = result.length
    const totalValue = useMemo(() => processed.reduce((acc, curr) => acc + curr.price, 0), [processed])

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value) // Actualiza inmediatamente (sin retrasos)
    }

    const handleLoadMore = () => {
        setCurrentPage((prev) => prev + 1)
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const hasMore = currentPage < totalPages

    if (loading) return <Loading />

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-8'>
                    <Header />

                    <Filter
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        sort={sort}
                        setSort={setSort}
                    />

                    <Stats
                        totalItems={totalItems}
                        totalValue={totalValue}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <FilteredData 
                            filteredData={processed} 
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LegacyDashboard
