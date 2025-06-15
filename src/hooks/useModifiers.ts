
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type DbModifier = Tables<'modifiers'>;

export interface Modifier {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isActive: boolean;
    applicableItems: string[];
    modifierType: 'addon' | 'substitute' | 'removal';
    maxQuantity: number;
    isRequired: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export type NewModifier = Omit<Modifier, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateModifier = Partial<NewModifier>;

const mapDbToAppModifier = (dbModifier: DbModifier): Modifier => ({
    id: dbModifier.id,
    name: dbModifier.name,
    description: dbModifier.description ?? '',
    price: dbModifier.price ?? 0,
    category: dbModifier.category,
    isActive: dbModifier.is_active ?? true,
    applicableItems: dbModifier.applicable_items ?? [],
    modifierType: dbModifier.modifier_type as 'addon' | 'substitute' | 'removal',
    maxQuantity: dbModifier.max_quantity ?? 1,
    isRequired: dbModifier.is_required ?? false,
    sortOrder: dbModifier.sort_order ?? 0,
    createdAt: dbModifier.created_at,
    updatedAt: dbModifier.updated_at,
});

const mapAppToDbModifier = (appModifier: UpdateModifier): TablesUpdate<'modifiers'> => ({
    name: appModifier.name,
    description: appModifier.description,
    price: appModifier.price,
    category: appModifier.category,
    is_active: appModifier.isActive,
    applicable_items: appModifier.applicableItems,
    modifier_type: appModifier.modifierType,
    max_quantity: appModifier.maxQuantity,
    is_required: appModifier.isRequired,
    sort_order: appModifier.sortOrder,
});


export function useModifiers() {
    const [modifiers, setModifiers] = useState<Modifier[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchModifiers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            toast({
                title: 'Error fetching modifiers',
                description: error.message,
                variant: 'destructive',
            });
            setModifiers([]);
        } else {
            setModifiers(data.map(mapDbToAppModifier));
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchModifiers();
    }, [fetchModifiers]);

    const addModifier = async (modifierData: NewModifier) => {
        if (!modifierData.name?.trim()) {
            toast({
                title: "Validation Error",
                description: "Modifier name is required.",
                variant: "destructive"
            });
            return null;
        }

        const dbData = mapAppToDbModifier(modifierData);

        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .insert(dbData as TablesInsert<'modifiers'>)
            .select()
            .single();
        
        if (error) {
            toast({
                title: 'Error creating modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return null;
        }
        
        await fetchModifiers();
        toast({
            title: 'Modifier Created',
            description: `"${modifierData.name}" has been created successfully.`,
        });
        setLoading(false);
        return data ? mapDbToAppModifier(data) : null;
    };

    const updateModifier = async (id: string, modifierData: UpdateModifier) => {
        if (modifierData.name !== undefined && !modifierData.name?.trim()) {
            toast({
                title: "Validation Error",
                description: "Modifier name is required.",
                variant: "destructive"
            });
            return null;
        }

        const dbData = mapAppToDbModifier(modifierData);

        setLoading(true);
        const { data, error } = await supabase
            .from('modifiers')
            .update({ ...dbData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast({
                title: 'Error updating modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return null;
        }

        await fetchModifiers();
        toast({
            title: 'Modifier Updated',
            description: `A modifier has been updated successfully.`,
        });
        setLoading(false);
        return data ? mapDbToAppModifier(data) : null;
    };
    
    const deleteModifier = async (id: string) => {
        setLoading(true);
        const { error } = await supabase
            .from('modifiers')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: 'Error deleting modifier',
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
            return;
        }

        await fetchModifiers();
        toast({
            title: 'Modifier Deleted',
            description: 'The modifier has been deleted successfully.',
        });
        setLoading(false);
    };

    const toggleModifierActive = async (id: string, currentState: boolean) => {
        setLoading(true);
        const { error } = await supabase
            .from('modifiers')
            .update({ is_active: !currentState, updated_at: new Date().toISOString() })
            .eq('id', id);
        
        if (error) {
            toast({
                title: 'Error updating status',
                description: error.message,
                variant: 'destructive',
            });
        }
        
        await fetchModifiers();
        setLoading(false);
    };

    return { modifiers, loading, addModifier, updateModifier, deleteModifier, toggleModifierActive };
}
