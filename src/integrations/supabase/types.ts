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
      bank_accounts: {
        Row: {
          account_iban: string
          account_name: string
          bank_name: string
          created_at: string
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          swift_code: string | null
          updated_at: string
        }
        Insert: {
          account_iban: string
          account_name: string
          bank_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          swift_code?: string | null
          updated_at?: string
        }
        Update: {
          account_iban?: string
          account_name?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          swift_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_logo_url: string | null
          company_name: string | null
          company_nif: string | null
          company_phone: string | null
          created_at: string
          currency: string | null
          email_notifications: boolean | null
          id: string
          payment_notes: string | null
          sms_notifications: boolean | null
          system_language: string | null
          system_theme: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_nif?: string | null
          company_phone?: string | null
          created_at?: string
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_notes?: string | null
          sms_notifications?: boolean | null
          system_language?: string | null
          system_theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_nif?: string | null
          company_phone?: string | null
          created_at?: string
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_notes?: string | null
          sms_notifications?: boolean | null
          system_language?: string | null
          system_theme?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      delivery_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          postal_code: string
          profile_id: string
          state: string
          street: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          postal_code: string
          profile_id: string
          state: string
          street: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          postal_code?: string
          profile_id?: string
          state?: string
          street?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_invoices: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          descricao: string | null
          event_request_id: string
          id: string
          numero: string
          status: string | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao?: string | null
          event_request_id: string
          id?: string
          numero: string
          status?: string | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao?: string | null
          event_request_id?: string
          id?: string
          numero?: string
          status?: string | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_invoices_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      event_requests: {
        Row: {
          atendido_em: string | null
          atendido_por: string | null
          created_at: string | null
          data_evento: string
          email: string
          id: string
          localizacao: string
          mensagem: string | null
          nome: string
          num_convidados: number
          status: string | null
          telefone: string
          tipo_evento: string
          updated_at: string | null
        }
        Insert: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          data_evento: string
          email: string
          id?: string
          localizacao: string
          mensagem?: string | null
          nome: string
          num_convidados: number
          status?: string | null
          telefone: string
          tipo_evento: string
          updated_at?: string | null
        }
        Update: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          data_evento?: string
          email?: string
          id?: string
          localizacao?: string
          mensagem?: string | null
          nome?: string
          num_convidados?: number
          status?: string | null
          telefone?: string
          tipo_evento?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          dish_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dish_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dish_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      grill_customizations: {
        Row: {
          available_marinades: string[] | null
          created_at: string | null
          id: string
          meat_doneness: string[] | null
          product_id: string | null
          side_dishes: string[] | null
          updated_at: string | null
        }
        Insert: {
          available_marinades?: string[] | null
          created_at?: string | null
          id?: string
          meat_doneness?: string[] | null
          product_id?: string | null
          side_dishes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          available_marinades?: string[] | null
          created_at?: string | null
          id?: string
          meat_doneness?: string[] | null
          product_id?: string | null
          side_dishes?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grill_customizations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      multicaixa_accounts: {
        Row: {
          account_name: string
          created_at: string
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          phone_number: string
          updated_at: string
        }
        Insert: {
          account_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          phone_number: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_info: Json
          delivery_address_id: string | null
          delivery_fee: number | null
          delivery_status: string | null
          estimated_delivery: string | null
          id: string
          items: Json
          notes: string | null
          payment_details: Json | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          processing_notes: string[] | null
          processing_status: string | null
          status: string
          subtotal: number | null
          total: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_info?: Json
          delivery_address_id?: string | null
          delivery_fee?: number | null
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          processing_notes?: string[] | null
          processing_status?: string | null
          status?: string
          subtotal?: number | null
          total: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_info?: Json
          delivery_address_id?: string | null
          delivery_fee?: number | null
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          processing_notes?: string[] | null
          processing_status?: string | null
          status?: string
          subtotal?: number | null
          total?: number
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          product_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          combo_serves: number | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_grill_product: boolean | null
          manufacturer: string | null
          meat_options: Json | null
          min_stock_quantity: number | null
          name: string
          prep_time_minutes: number | null
          price: number
          sale_unit: string | null
          seller_contact: string | null
          seller_id: string | null
          seller_name: string | null
          sku: string | null
          spice_level: number | null
          stock_quantity: number | null
          tax_rate: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          combo_serves?: number | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_grill_product?: boolean | null
          manufacturer?: string | null
          meat_options?: Json | null
          min_stock_quantity?: number | null
          name: string
          prep_time_minutes?: number | null
          price: number
          sale_unit?: string | null
          seller_contact?: string | null
          seller_id?: string | null
          seller_name?: string | null
          sku?: string | null
          spice_level?: number | null
          stock_quantity?: number | null
          tax_rate?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          combo_serves?: number | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_grill_product?: boolean | null
          manufacturer?: string | null
          meat_options?: Json | null
          min_stock_quantity?: number | null
          name?: string
          prep_time_minutes?: number | null
          price?: number
          sale_unit?: string | null
          seller_contact?: string | null
          seller_id?: string | null
          seller_name?: string | null
          sku?: string | null
          spice_level?: number | null
          stock_quantity?: number | null
          tax_rate?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_postal_code: string | null
          address_province: string | null
          address_street: string | null
          bank_account_iban: string | null
          bank_account_name: string | null
          bank_name: string | null
          business_license_number: string | null
          business_license_url: string | null
          company_address: string | null
          company_email: string | null
          company_logo_url: string | null
          company_name: string | null
          company_nif: string | null
          company_phone: string | null
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          id_document_number: string | null
          id_document_type: string | null
          id_document_url: string | null
          multicaixa_name: string | null
          multicaixa_phone: string | null
          nif: string | null
          payment_notes: string | null
          phone: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          seller_status: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id: string | null
          total_sales: number | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          bank_account_iban?: string | null
          bank_account_name?: string | null
          bank_name?: string | null
          business_license_number?: string | null
          business_license_url?: string | null
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_nif?: string | null
          company_phone?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id: string
          id_document_number?: string | null
          id_document_type?: string | null
          id_document_url?: string | null
          multicaixa_name?: string | null
          multicaixa_phone?: string | null
          nif?: string | null
          payment_notes?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          seller_status?: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          bank_account_iban?: string | null
          bank_account_name?: string | null
          bank_name?: string | null
          business_license_number?: string | null
          business_license_url?: string | null
          company_address?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_nif?: string | null
          company_phone?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          id_document_number?: string | null
          id_document_type?: string | null
          id_document_url?: string | null
          multicaixa_name?: string | null
          multicaixa_phone?: string | null
          nif?: string | null
          payment_notes?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          seller_status?: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applies_to_category_id: string | null
          combo_products: Json | null
          created_at: string
          discount_percentage: number
          end_date: string
          id: string
          min_quantity: number | null
          product_id: string | null
          promotion_type: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          applies_to_category_id?: string | null
          combo_products?: Json | null
          created_at?: string
          discount_percentage: number
          end_date: string
          id?: string
          min_quantity?: number | null
          product_id?: string | null
          promotion_type?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          applies_to_category_id?: string | null
          combo_products?: Json | null
          created_at?: string
          discount_percentage?: number
          end_date?: string
          id?: string
          min_quantity?: number | null
          product_id?: string | null
          promotion_type?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_applies_to_category_id_fkey"
            columns: ["applies_to_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          product_id: string | null
          quantity: number
          reason: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          reason: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          reason?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      seller_status: "pending" | "active" | "suspended"
      user_role: "customer" | "seller" | "admin"
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
      seller_status: ["pending", "active", "suspended"],
      user_role: ["customer", "seller", "admin"],
    },
  },
} as const
