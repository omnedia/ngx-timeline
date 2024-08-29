import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject, takeUntil } from "rxjs";
import { TimelineEntry, TimelineEntryTemplate } from "./ngx-timeline.types";

@Component({
  selector: "om-timeline",
  templateUrl: "./ngx-timeline.component.html",
  styleUrls: ["./ngx-timeline.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class NgxTimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild("wrapper")
  wrapperRef!: ElementRef<HTMLElement>;

  @ViewChildren("entries") entriesList!: QueryList<HTMLElement>;

  @ViewChild("timelineBackground")
  timelineBackgroundRef!: ElementRef<HTMLElement>;

  @ViewChild("timelineLine")
  timelineLineRef!: ElementRef<HTMLElement>;

  @Input("orientation")
  orientation: "left" | "right" = "left";

  @Input("styleClass")
  styleClass?: string;

  @Input("entriesGap")
  set entriesGap(gap: string) {
    this.style["--om-timeline-entries-gap"] = gap;
  }

  @Input("entryGap")
  set entryGap(gap: string) {
    this.style["--om-timeline-entry-gap"] = gap;
  }

  @Input("titleGap")
  set titleGap(gap: string) {
    this.style["--om-timeline-entry-title-gap"] = gap;
  }

  @Input("data")
  set dataValue(data: TimelineEntry[]) {
    this.data = data;
    this.addViewEncapsulationTag();
  }

  private data: TimelineEntry[] = [];

  templateData: TimelineEntryTemplate[] = [];

  style: any = {};

  private ngContentRef?: string;

  private scrollableParent: HTMLElement | Window = window;
  private scrollListener!: () => void;

  ngAfterViewInit(): void {
    this.getViewEncapsulationTag();
    this.determineScrollContext();

    this.entriesList.changes.pipe(takeUntil(this.destroy$)).subscribe((t) => {
      this.setHeight();
    });

    this.updateTimelineLine();

    window.addEventListener("resize", () => this.setHeight());
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.removeScrollListener();

    window.removeEventListener("resize", () => this.setHeight());
  }

  constructor(
    private readonly sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  getViewEncapsulationTag(): void {
    const parent = this.wrapperRef.nativeElement.parentElement?.parentElement;

    if (!parent) {
      return;
    }

    const attributes = parent.getAttributeNames();
    const ngContentRef = attributes.find((attr) =>
      attr.includes("_ngcontent-ng")
    );

    if (!ngContentRef) {
      return;
    }

    this.ngContentRef = ngContentRef;

    this.addViewEncapsulationTag();
  }

  addViewEncapsulationTag(): void {
    if (!this.data || this.data.length <= 0 || !this.ngContentRef) {
      return;
    }

    this.data.forEach((data, index) => {
      const title = this.insertAttributeInTags(data.title);
      const content = this.insertAttributeInTags(data.content);

      const templateData: TimelineEntryTemplate = {
        title: this.sanitizer.bypassSecurityTrustHtml(title),
        content: this.sanitizer.bypassSecurityTrustHtml(content),
      };

      this.templateData.push(templateData);
    });
  }

  private insertAttributeInTags(inputString: string): string {
    return inputString.replace(/<(\w+)/g, `<$1 ${this.ngContentRef}`);
  }

  private determineScrollContext() {
    let parent = this.wrapperRef.nativeElement.parentElement;
    while (parent && parent !== document.body) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        this.scrollableParent = parent;
        break;
      }
      parent = parent.parentElement;
    }
    this.setupScrollListener();
  }

  private setupScrollListener() {
    this.scrollListener = this.renderer.listen(
      this.scrollableParent,
      "scroll",
      () => this.updateTimelineLine()
    );
  }

  private removeScrollListener() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  setHeight(): void {
    const rect = this.wrapperRef.nativeElement.getBoundingClientRect();
    this.timelineBackgroundRef.nativeElement.style.height = `${rect.height}px`;
    this.updateTimelineLine();
  }

  updateTimelineLine(): void {
    const rect = this.wrapperRef.nativeElement.getBoundingClientRect();
    const scrollHeight =
      this.scrollableParent === window
        ? window.innerHeight
        : (this.scrollableParent as HTMLElement).clientHeight;

    const topPosition =
      this.scrollableParent === window
        ? rect.top * -1
        : (this.scrollableParent as HTMLElement).scrollTop;

    let progress = topPosition / rect.height;

    if (topPosition >= rect.height || progress >= 1) {
      this.timelineLineRef.nativeElement.style.height = `${rect.height}px`;
      return;
    }

    this.timelineLineRef.nativeElement.style.height = `${
      progress * rect.height + scrollHeight * 0.5
    }px`;
  }
}
