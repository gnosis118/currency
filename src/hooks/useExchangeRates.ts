import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ExchangeRates {
  [key: string]: number;
}

interface CryptoPrice {
  [key: string]: number;
}

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useExchangeRates = (baseCurrency: string) => {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['exchangeRates', baseCurrency],
    queryFn: async (): Promise<ExchangeRates> => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        return data.rates;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch exchange rates. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return query;
};

export const useCryptoPrice = (cryptoId: string, vsCurrency: string = 'usd') => {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['cryptoPrice', cryptoId, vsCurrency],
    queryFn: async (): Promise<CryptoPrice> => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}&include_24hr_change=true`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch crypto price');
        }

        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch cryptocurrency prices. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return query;
};

export const useRefreshRates = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
    queryClient.invalidateQueries({ queryKey: ['cryptoPrice'] });
  };
};