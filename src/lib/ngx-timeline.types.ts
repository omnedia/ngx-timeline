import { SafeHtml } from "@angular/platform-browser";

export type TimelineEntry = {
  title: string;
  content: string;
};

export type TimelineEntryTemplate = {
  title: SafeHtml;
  content: SafeHtml;
};
