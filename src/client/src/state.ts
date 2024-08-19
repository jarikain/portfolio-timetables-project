import { ref } from "vue";

export interface View {
  path: string;
  type: "bus" | "train";
  id: string;
}

export const currentView = ref<View | null>(null);