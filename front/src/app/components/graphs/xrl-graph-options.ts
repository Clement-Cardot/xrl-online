import { LayoutPosition } from "chart.js";

export interface XrlGraphOptions {
  /**
   * Show legend
   * @default false
   */
  legend?: boolean;
  /**
   * Show download button
   * Only use for Radar graph
   * @default false
   */
  download?: boolean;
  /**
   * Legend position
   * @default top
   */
  legendPosition?: LayoutPosition;
  /**
   * Legend title
   * The substring '${date}' will be replaced by the date of the assessment
   * Use '|' to separate the title of the new and the last assessment (first is the new)
   * Only use for Radar graph
   * @default '${date}'
   */
  legendTitle?: string;
  /**
   * Boolean use when download graph only for project report
   * @default false
   */
  isDownloadOnlyUse?: boolean;
  /**
   * Boolean use for set click and cursor pointer to labels for Radar graph
   * @default false
   */
  labelsClick?: boolean;
}