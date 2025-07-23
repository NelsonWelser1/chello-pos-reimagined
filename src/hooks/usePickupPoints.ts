import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PickupPointService, PickupPoint, PickupOrder, NewPickupPoint, NewPickupOrder } from '@/services/pickupPointService';

// Pickup Points Hooks
export function usePickupPoints() {
  return useQuery({
    queryKey: ['pickup-points'],
    queryFn: PickupPointService.getPickupPoints,
  });
}

export function useActivePickupPoints() {
  return useQuery({
    queryKey: ['pickup-points', 'active'],
    queryFn: PickupPointService.getActivePickupPoints,
  });
}

export function usePickupPoint(id: string) {
  return useQuery({
    queryKey: ['pickup-points', id],
    queryFn: () => PickupPointService.getPickupPointById(id),
    enabled: !!id,
  });
}

export function useCreatePickupPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewPickupPoint) => PickupPointService.createPickupPoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-points'] });
    },
  });
}

export function useUpdatePickupPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewPickupPoint> }) => 
      PickupPointService.updatePickupPoint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-points'] });
    },
  });
}

export function useDeletePickupPoint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PickupPointService.deletePickupPoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-points'] });
    },
  });
}

// Pickup Orders Hooks
export function usePickupOrders() {
  return useQuery({
    queryKey: ['pickup-orders'],
    queryFn: PickupPointService.getPickupOrders,
  });
}

export function usePickupOrdersByPoint(pickupPointId: string) {
  return useQuery({
    queryKey: ['pickup-orders', 'point', pickupPointId],
    queryFn: () => PickupPointService.getPickupOrdersByPoint(pickupPointId),
    enabled: !!pickupPointId,
  });
}

export function usePickupOrderByCode(pickupCode: string) {
  return useQuery({
    queryKey: ['pickup-orders', 'code', pickupCode],
    queryFn: () => PickupPointService.getPickupOrderByCode(pickupCode),
    enabled: !!pickupCode,
  });
}

export function useCreatePickupOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewPickupOrder) => PickupPointService.createPickupOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-orders'] });
      queryClient.invalidateQueries({ queryKey: ['pickup-points'] });
    },
  });
}

export function useMarkOrderReady() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId?: string }) => 
      PickupPointService.markOrderReady(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-orders'] });
    },
  });
}

export function useMarkOrderPickedUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PickupPointService.markOrderPickedUp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickup-orders'] });
      queryClient.invalidateQueries({ queryKey: ['pickup-points'] });
    },
  });
}

// Analytics Hooks
export function usePickupAnalytics() {
  return useQuery({
    queryKey: ['pickup-analytics'],
    queryFn: PickupPointService.getPickupAnalytics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useSearchPickupPoints(query: string) {
  return useQuery({
    queryKey: ['pickup-points', 'search', query],
    queryFn: () => PickupPointService.searchPickupPoints(query),
    enabled: !!query && query.length > 2,
  });
}

export function useNearbyPickupPoints(
  latitude: number, 
  longitude: number, 
  radiusKm: number = 10
) {
  return useQuery({
    queryKey: ['pickup-points', 'nearby', latitude, longitude, radiusKm],
    queryFn: () => PickupPointService.findNearbyPickupPoints(latitude, longitude, radiusKm),
    enabled: !!latitude && !!longitude,
  });
}