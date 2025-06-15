export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expense_types: {
        Row: {
          allow_over_budget: boolean
          approval_threshold: number
          auto_recurring: boolean
          budget_limit: number
          budget_period: string
          category: string
          color: string
          cost_center: string | null
          created_at: string
          default_vendors: string[] | null
          description: string | null
          gl_code: string | null
          id: string
          is_active: boolean
          name: string
          notification_threshold: number
          priority: string
          requires_approval: boolean
          restricted_users: string[] | null
          tags: string[] | null
          tax_deductible: boolean
          updated_at: string
        }
        Insert: {
          allow_over_budget?: boolean
          approval_threshold?: number
          auto_recurring?: boolean
          budget_limit?: number
          budget_period?: string
          category: string
          color?: string
          cost_center?: string | null
          created_at?: string
          default_vendors?: string[] | null
          description?: string | null
          gl_code?: string | null
          id?: string
          is_active?: boolean
          name: string
          notification_threshold?: number
          priority?: string
          requires_approval?: boolean
          restricted_users?: string[] | null
          tags?: string[] | null
          tax_deductible?: boolean
          updated_at?: string
        }
        Update: {
          allow_over_budget?: boolean
          approval_threshold?: number
          auto_recurring?: boolean
          budget_limit?: number
          budget_period?: string
          category?: string
          color?: string
          cost_center?: string | null
          created_at?: string
          default_vendors?: string[] | null
          description?: string | null
          gl_code?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notification_threshold?: number
          priority?: string
          requires_approval?: boolean
          restricted_users?: string[] | null
          tags?: string[] | null
          tax_deductible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          allergens: string[] | null
          category: string
          cost_per_unit: number | null
          created_at: string
          current_stock: number | null
          expiry_date: string | null
          id: string
          is_perishable: boolean | null
          last_restocked: string | null
          maximum_stock: number | null
          minimum_stock: number | null
          name: string
          nutritional_calories: number | null
          nutritional_carbs: number | null
          nutritional_fat: number | null
          nutritional_fiber: number | null
          nutritional_protein: number | null
          storage_location: string | null
          supplier: string | null
          supplier_contact: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category: string
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number | null
          expiry_date?: string | null
          id?: string
          is_perishable?: boolean | null
          last_restocked?: string | null
          maximum_stock?: number | null
          minimum_stock?: number | null
          name: string
          nutritional_calories?: number | null
          nutritional_carbs?: number | null
          nutritional_fat?: number | null
          nutritional_fiber?: number | null
          nutritional_protein?: number | null
          storage_location?: string | null
          supplier?: string | null
          supplier_contact?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category?: string
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number | null
          expiry_date?: string | null
          id?: string
          is_perishable?: boolean | null
          last_restocked?: string | null
          maximum_stock?: number | null
          minimum_stock?: number | null
          name?: string
          nutritional_calories?: number | null
          nutritional_carbs?: number | null
          nutritional_fat?: number | null
          nutritional_fiber?: number | null
          nutritional_protein?: number | null
          storage_location?: string | null
          supplier?: string | null
          supplier_contact?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      kitchen_order_items: {
        Row: {
          created_at: string
          id: string
          kitchen_order_id: string
          order_item_id: string
          prep_time: number
          special_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kitchen_order_id: string
          order_item_id: string
          prep_time?: number
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kitchen_order_id?: string
          order_item_id?: string
          prep_time?: number
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_order_items_kitchen_order_id_fkey"
            columns: ["kitchen_order_id"]
            isOneToOne: false
            referencedRelation: "kitchen_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_order_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_orders: {
        Row: {
          actual_completion_time: string | null
          actual_start_time: string | null
          created_at: string
          estimated_time: number
          id: string
          notes: string | null
          order_id: string
          priority: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_completion_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          estimated_time?: number
          id?: string
          notes?: string | null
          order_id: string
          priority?: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_completion_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          estimated_time?: number
          id?: string
          notes?: string | null
          order_id?: string
          priority?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_available: boolean | null
          is_gluten_free: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          low_stock_alert: number
          modifiers: string[] | null
          name: string
          preparation_time: number
          price: number
          stock_count: number
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          low_stock_alert?: number
          modifiers?: string[] | null
          name: string
          preparation_time?: number
          price?: number
          stock_count?: number
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          low_stock_alert?: number
          modifiers?: string[] | null
          name?: string
          preparation_time?: number
          price?: number
          stock_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      modifiers: {
        Row: {
          applicable_items: string[] | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          max_quantity: number | null
          modifier_type: string
          name: string
          price: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          applicable_items?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_quantity?: number | null
          modifier_type: string
          name: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          applicable_items?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          max_quantity?: number | null
          modifier_type?: string
          name?: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          modifiers: Json | null
          order_id: string
          quantity: number
          special_instructions: string | null
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          modifiers?: Json | null
          order_id: string
          quantity?: number
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          modifiers?: Json | null
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          notes: string | null
          payment_method: string
          staff_id: string | null
          status: string
          subtotal: number
          table_number: number | null
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          staff_id?: string | null
          status?: string
          subtotal?: number
          table_number?: number | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          staff_id?: string | null
          status?: string
          subtotal?: number
          table_number?: number | null
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string
          hourly_rate: number | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          pin_code: string | null
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          pin_code?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          pin_code?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      staff_role: "Admin" | "Manager" | "Chef" | "Waiter" | "Cashier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      staff_role: ["Admin", "Manager", "Chef", "Waiter", "Cashier"],
    },
  },
} as const
