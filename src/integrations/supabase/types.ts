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
          delivery_status: string | null
          estimated_delivery: string | null
          id: string
          items: Json
          payment_details: Json | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          processing_notes: string[] | null
          processing_status: string | null
          status: string
          total: number
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_info?: Json
          delivery_address_id?: string | null
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          payment_details?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          processing_notes?: string[] | null
          processing_status?: string | null
          status?: string
          total: number
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_info?: Json
          delivery_address_id?: string | null
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          items?: Json
          payment_details?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          processing_notes?: string[] | null
          processing_status?: string | null
          status?: string
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
          cost: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          manufacturer: string | null
          min_stock_quantity: number | null
          name: string
          price: number
          seller_contact: string | null
          seller_id: string | null
          seller_name: string | null
          sku: string | null
          stock_quantity: number | null
          tax_rate: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          min_stock_quantity?: number | null
          name: string
          price: number
          seller_contact?: string | null
          seller_id?: string | null
          seller_name?: string | null
          sku?: string | null
          stock_quantity?: number | null
          tax_rate?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          min_stock_quantity?: number | null
          name?: string
          price?: number
          seller_contact?: string | null
          seller_id?: string | null
          seller_name?: string | null
          sku?: string | null
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
          business_license_number: string | null
          business_license_url: string | null
          company_name: string | null
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          id_document_number: string | null
          id_document_type: string | null
          id_document_url: string | null
          nif: string | null
          phone: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          seller_status: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id: string | null
          total_sales: number | null
          verification_status: string | null
        }
        Insert: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          business_license_number?: string | null
          business_license_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id: string
          id_document_number?: string | null
          id_document_type?: string | null
          id_document_url?: string | null
          nif?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          seller_status?: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id?: string | null
          total_sales?: number | null
          verification_status?: string | null
        }
        Update: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          business_license_number?: string | null
          business_license_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          id_document_number?: string | null
          id_document_type?: string | null
          id_document_url?: string | null
          nif?: string | null
          phone?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          seller_status?: Database["public"]["Enums"]["seller_status"] | null
          stripe_account_id?: string | null
          total_sales?: number | null
          verification_status?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          discount_percentage: number
          end_date: string
          id: string
          product_id: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percentage: number
          end_date: string
          id?: string
          product_id?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          end_date?: string
          id?: string
          product_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
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
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
