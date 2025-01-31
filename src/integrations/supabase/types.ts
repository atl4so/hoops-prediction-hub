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
      background_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          opacity: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          opacity?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          opacity?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      game_results: {
        Row: {
          away_score: number
          created_at: string
          game_id: string | null
          home_score: number
          id: string
          is_final: boolean
          updated_at: string
        }
        Insert: {
          away_score: number
          created_at?: string
          game_id?: string | null
          home_score: number
          id?: string
          is_final?: boolean
          updated_at?: string
        }
        Update: {
          away_score?: number
          created_at?: string
          game_id?: string | null
          home_score?: number
          id?: string
          is_final?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          away_team_id: string
          created_at: string
          game_code: string | null
          game_date: string
          home_team_id: string
          id: string
          round_id: string
          updated_at: string
        }
        Insert: {
          away_team_id: string
          created_at?: string
          game_code?: string | null
          game_date: string
          home_team_id: string
          id?: string
          round_id: string
          updated_at?: string
        }
        Update: {
          away_team_id?: string
          created_at?: string
          game_code?: string | null
          game_date?: string
          home_team_id?: string
          id?: string
          round_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          created_at: string
          game_id: string | null
          id: string
          points_earned: number | null
          prediction_away_score: number
          prediction_home_score: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          game_id?: string | null
          id?: string
          points_earned?: number | null
          prediction_away_score: number
          prediction_home_score: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string | null
          id?: string
          points_earned?: number | null
          prediction_away_score?: number
          prediction_home_score?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          away_winner_predictions_correct: number | null
          away_winner_predictions_total: number | null
          created_at: string
          display_name: string
          display_name_lower: string | null
          email: string
          highest_game_points: number | null
          highest_round_points: number | null
          home_winner_predictions_correct: number | null
          home_winner_predictions_total: number | null
          id: string
          is_admin: boolean | null
          kaspa_address: string | null
          lowest_game_points: number | null
          lowest_round_points: number | null
          over_under_predictions_correct: number | null
          over_under_predictions_total: number | null
          points_per_game: number | null
          total_points: number | null
          total_predictions: number | null
          updated_at: string
          winner_predictions_correct: number | null
          winner_predictions_total: number | null
        }
        Insert: {
          avatar_url?: string | null
          away_winner_predictions_correct?: number | null
          away_winner_predictions_total?: number | null
          created_at?: string
          display_name: string
          display_name_lower?: string | null
          email: string
          highest_game_points?: number | null
          highest_round_points?: number | null
          home_winner_predictions_correct?: number | null
          home_winner_predictions_total?: number | null
          id: string
          is_admin?: boolean | null
          kaspa_address?: string | null
          lowest_game_points?: number | null
          lowest_round_points?: number | null
          over_under_predictions_correct?: number | null
          over_under_predictions_total?: number | null
          points_per_game?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string
          winner_predictions_correct?: number | null
          winner_predictions_total?: number | null
        }
        Update: {
          avatar_url?: string | null
          away_winner_predictions_correct?: number | null
          away_winner_predictions_total?: number | null
          created_at?: string
          display_name?: string
          display_name_lower?: string | null
          email?: string
          highest_game_points?: number | null
          highest_round_points?: number | null
          home_winner_predictions_correct?: number | null
          home_winner_predictions_total?: number | null
          id?: string
          is_admin?: boolean | null
          kaspa_address?: string | null
          lowest_game_points?: number | null
          lowest_round_points?: number | null
          over_under_predictions_correct?: number | null
          over_under_predictions_total?: number | null
          points_per_game?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string
          winner_predictions_correct?: number | null
          winner_predictions_total?: number | null
        }
        Relationships: []
      }
      round_user_stats: {
        Row: {
          created_at: string
          efficiency_rating: number | null
          finished_games: number | null
          id: string
          round_id: string | null
          total_points: number | null
          total_predictions: number | null
          underdog_prediction_rate: number | null
          updated_at: string
          user_id: string | null
          winner_predictions_correct: number | null
          winner_predictions_total: number | null
        }
        Insert: {
          created_at?: string
          efficiency_rating?: number | null
          finished_games?: number | null
          id?: string
          round_id?: string | null
          total_points?: number | null
          total_predictions?: number | null
          underdog_prediction_rate?: number | null
          updated_at?: string
          user_id?: string | null
          winner_predictions_correct?: number | null
          winner_predictions_total?: number | null
        }
        Update: {
          created_at?: string
          efficiency_rating?: number | null
          finished_games?: number | null
          id?: string
          round_id?: string | null
          total_points?: number | null
          total_predictions?: number | null
          underdog_prediction_rate?: number | null
          updated_at?: string
          user_id?: string | null
          winner_predictions_correct?: number | null
          winner_predictions_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "round_user_stats_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rounds: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_prediction_stats: {
        Row: {
          created_at: string | null
          id: string
          team_id: string | null
          updated_at: string | null
          user_id: string | null
          wins_correct: number | null
          wins_predicted: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wins_correct?: number | null
          wins_predicted?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wins_correct?: number | null
          wins_predicted?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_prediction_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_prediction_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          logo_url: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_view_future_predictions: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          can_view_future_predictions?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          can_view_future_predictions?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
      calculate_prediction_points: {
        Args: {
          pred_home: number
          pred_away: number
          actual_home: number
          actual_away: number
        }
        Returns: number
      }
      calculate_user_round_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_game_completely: {
        Args: {
          game_id: string
        }
        Returns: undefined
      }
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      delete_user_completely: {
        Args: {
          email_arg: string
        }
        Returns: undefined
      }
      get_game_prediction_insights: {
        Args: {
          game_id_param: string
        }
        Returns: {
          total_predictions: number
          home_win_predictions: number
          away_win_predictions: number
          avg_home_score: number
          avg_away_score: number
          common_margin_range: string
          common_total_points_range: string
          last_game_result: Json
          game_result: Json
          avg_home_win_margin: number
          avg_away_win_margin: number
          total_underdog_picks: number
        }[]
      }
      get_round_rankings: {
        Args: {
          round_id: string
        }
        Returns: {
          user_id: string
          display_name: string
          total_points: number
          predictions_count: number
        }[]
      }
      get_team_prediction_stats: {
        Args: {
          team_id_param: string
        }
        Returns: {
          total_games: number
          total_predictions: number
          overall_success_rate: number
          home_success_rate: number
          away_success_rate: number
          underdog_wins: number
          unexpected_losses: number
          avg_upset_margin: number
          avg_loss_margin: number
          margin_1_9_wins: number
          margin_10_15_wins: number
          margin_15plus_wins: number
          margin_1_9_losses: number
          margin_10_15_losses: number
          margin_15plus_losses: number
          home_games: number
          away_games: number
          percentage_favoring_team: number
          wins_predicted: number
          losses_predicted: number
        }[]
      }
      get_team_result_distribution: {
        Args: {
          team_id_param: string
        }
        Returns: {
          margin_range: string
          win_percentage: number
          loss_percentage: number
        }[]
      }
      get_team_top_predictors: {
        Args: {
          team_id_param: string
          min_games?: number
        }
        Returns: {
          user_id: string
          display_name: string
          success_rate: number
          correct_predictions: number
          total_predictions: number
          avatar_url: string
        }[]
      }
      get_user_all_time_underdog_picks: {
        Args: {
          user_id_param: string
        }
        Returns: {
          total_underdog_picks: number
        }[]
      }
      recalculate_all_prediction_points: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_all_round_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_home_away_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_over_under_predictions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_advanced_prediction_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_game_code: {
        Args: {
          p_game_id: string
          p_game_code: string
        }
        Returns: undefined
      }
      update_game_result: {
        Args: {
          game_id_param: string
          home_score_param: number
          away_score_param: number
        }
        Returns: undefined
      }
      update_profile_stats: {
        Args: {
          user_id_arg: string
          total_points_arg: number
          total_predictions_arg: number
          points_per_game_arg: number
          highest_game_points_arg: number
          lowest_game_points_arg: number
        }
        Returns: undefined
      }
      update_user_profile: {
        Args: {
          avatar_url_arg: string
          user_id_arg: string
        }
        Returns: undefined
      }
      upsert_game_result: {
        Args: {
          p_game_id: string
          p_home_score: number
          p_away_score: number
          p_is_final: boolean
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
