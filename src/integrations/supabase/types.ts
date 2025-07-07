export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          table_session_id: string | null
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
          table_session_id?: string | null
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
          table_session_id?: string | null
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
      payment_configurations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      payment_fraud_logs: {
        Row: {
          action_taken: string
          created_at: string
          fraud_indicators: Json | null
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          risk_score: number | null
          rule_id: string | null
          transaction_id: string | null
        }
        Insert: {
          action_taken: string
          created_at?: string
          fraud_indicators?: Json | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          risk_score?: number | null
          rule_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          action_taken?: string
          created_at?: string
          fraud_indicators?: Json | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          risk_score?: number | null
          rule_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_fraud_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "payment_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_fraud_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_method_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          api_key: string
          created_at: string
          description: string | null
          enabled: boolean
          environment: string
          id: string
          max_transaction_amount: number | null
          merchant_id: string | null
          min_transaction_amount: number | null
          name: string
          priority: number
          provider: string
          public_key: string | null
          secret_key: string
          supported_currencies: string[]
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          environment: string
          id?: string
          max_transaction_amount?: number | null
          merchant_id?: string | null
          min_transaction_amount?: number | null
          name: string
          priority?: number
          provider: string
          public_key?: string | null
          secret_key: string
          supported_currencies?: string[]
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          environment?: string
          id?: string
          max_transaction_amount?: number | null
          merchant_id?: string | null
          min_transaction_amount?: number | null
          name?: string
          priority?: number
          provider?: string
          public_key?: string | null
          secret_key?: string
          supported_currencies?: string[]
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_method_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_id: string | null
          error_message: string | null
          fee_amount: number
          gateway_id: string | null
          gateway_reference: string | null
          gateway_transaction_id: string | null
          id: string
          net_amount: number
          order_id: string | null
          payment_method_id: string | null
          processed_at: string | null
          response_data: Json | null
          staff_id: string | null
          status: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          error_message?: string | null
          fee_amount?: number
          gateway_id?: string | null
          gateway_reference?: string | null
          gateway_transaction_id?: string | null
          id?: string
          net_amount: number
          order_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          response_data?: Json | null
          staff_id?: string | null
          status: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          error_message?: string | null
          fee_amount?: number
          gateway_id?: string | null
          gateway_reference?: string | null
          gateway_transaction_id?: string | null
          id?: string
          net_amount?: number
          order_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          response_data?: Json | null
          staff_id?: string | null
          status?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_method_transactions_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_method_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          api_key: string | null
          auto_settlement: boolean
          created_at: string
          currency: string
          daily_limit: number | null
          description: string | null
          enabled: boolean
          id: string
          merchant_id: string | null
          monthly_limit: number | null
          name: string
          processing_fee_fixed: number
          processing_fee_percentage: number
          provider: string | null
          requires_verification: boolean
          terminal_id: string | null
          type: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          auto_settlement?: boolean
          created_at?: string
          currency?: string
          daily_limit?: number | null
          description?: string | null
          enabled?: boolean
          id?: string
          merchant_id?: string | null
          monthly_limit?: number | null
          name: string
          processing_fee_fixed?: number
          processing_fee_percentage?: number
          provider?: string | null
          requires_verification?: boolean
          terminal_id?: string | null
          type: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          auto_settlement?: boolean
          created_at?: string
          currency?: string
          daily_limit?: number | null
          description?: string | null
          enabled?: boolean
          id?: string
          merchant_id?: string | null
          monthly_limit?: number | null
          name?: string
          processing_fee_fixed?: number
          processing_fee_percentage?: number
          provider?: string | null
          requires_verification?: boolean
          terminal_id?: string | null
          type?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_refunds: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string
          gateway_refund_id: string | null
          id: string
          original_transaction_id: string
          processed_at: string | null
          reason: string
          refund_transaction_id: string
          refund_type: string
          requested_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          original_transaction_id: string
          processed_at?: string | null
          reason: string
          refund_transaction_id: string
          refund_type: string
          requested_by?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          original_transaction_id?: string
          processed_at?: string | null
          reason?: string
          refund_transaction_id?: string
          refund_type?: string
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_refunds_original_transaction_id_fkey"
            columns: ["original_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_method_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_rules: {
        Row: {
          actions: Json
          allowed_countries: string[] | null
          applies_to_methods: string[] | null
          blocked_countries: string[] | null
          conditions: Json
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          max_amount: number | null
          min_amount: number | null
          name: string
          priority: number
          rule_type: string
          time_restrictions: Json | null
          updated_at: string
        }
        Insert: {
          actions?: Json
          allowed_countries?: string[] | null
          applies_to_methods?: string[] | null
          blocked_countries?: string[] | null
          conditions?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          max_amount?: number | null
          min_amount?: number | null
          name: string
          priority?: number
          rule_type: string
          time_restrictions?: Json | null
          updated_at?: string
        }
        Update: {
          actions?: Json
          allowed_countries?: string[] | null
          applies_to_methods?: string[] | null
          blocked_countries?: string[] | null
          conditions?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          max_amount?: number | null
          min_amount?: number | null
          name?: string
          priority?: number
          rule_type?: string
          time_restrictions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          customer_name: string
          date: string
          duration_minutes: number | null
          email: string | null
          id: string
          party_size: number
          phone: string
          special_requests: string | null
          status: string
          table_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          date: string
          duration_minutes?: number | null
          email?: string | null
          id?: string
          party_size: number
          phone: string
          special_requests?: string | null
          status?: string
          table_id?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          date?: string
          duration_minutes?: number | null
          email?: string | null
          id?: string
          party_size?: number
          phone?: string
          special_requests?: string | null
          status?: string
          table_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_analytics: {
        Row: {
          average_order_value: number
          created_at: string
          date: string
          hourly_sales: Json | null
          id: string
          menu_performance: Json | null
          payment_methods_breakdown: Json | null
          peak_hour: number | null
          peak_hour_sales: number | null
          staff_performance: Json | null
          total_customers: number
          total_orders: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          average_order_value?: number
          created_at?: string
          date: string
          hourly_sales?: Json | null
          id?: string
          menu_performance?: Json | null
          payment_methods_breakdown?: Json | null
          peak_hour?: number | null
          peak_hour_sales?: number | null
          staff_performance?: Json | null
          total_customers?: number
          total_orders?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          average_order_value?: number
          created_at?: string
          date?: string
          hourly_sales?: Json | null
          id?: string
          menu_performance?: Json | null
          payment_methods_breakdown?: Json | null
          peak_hour?: number | null
          peak_hour_sales?: number | null
          staff_performance?: Json | null
          total_customers?: number
          total_orders?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
      sales_targets: {
        Row: {
          achieved: boolean | null
          created_at: string
          created_by: string | null
          current_amount: number | null
          id: string
          staff_id: string | null
          target_amount: number
          target_date: string
          target_name: string
          target_type: string
          updated_at: string
        }
        Insert: {
          achieved?: boolean | null
          created_at?: string
          created_by?: string | null
          current_amount?: number | null
          id?: string
          staff_id?: string | null
          target_amount: number
          target_date: string
          target_name: string
          target_type: string
          updated_at?: string
        }
        Update: {
          achieved?: boolean | null
          created_at?: string
          created_by?: string | null
          current_amount?: number | null
          id?: string
          staff_id?: string | null
          target_amount?: number
          target_date?: string
          target_name?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_targets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_targets_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_transactions: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_id: string | null
          payment_method: string
          payment_status: string
          refund_amount: number | null
          refund_reason: string | null
          staff_id: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          transaction_date: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method: string
          payment_status?: string
          refund_amount?: number | null
          refund_reason?: string | null
          staff_id?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          transaction_date?: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string
          payment_status?: string
          refund_amount?: number | null
          refund_reason?: string | null
          staff_id?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          transaction_date?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_staff_id_fkey"
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
      table_sessions: {
        Row: {
          created_at: string
          customer_name: string | null
          ended_at: string | null
          id: string
          notes: string | null
          party_size: number
          started_at: string
          status: string
          table_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          party_size: number
          started_at?: string
          status?: string
          table_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          party_size?: number
          started_at?: string
          status?: string
          table_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          created_at: string
          id: string
          location: string
          notes: string | null
          number: number
          position_x: number
          position_y: number
          seats: number
          shape: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          number: number
          position_x?: number
          position_y?: number
          seats: number
          shape: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          number?: number
          position_x?: number
          position_y?: number
          seats?: number
          shape?: string
          status?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
