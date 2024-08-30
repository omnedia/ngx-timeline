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

  @ViewChildren("entries") entriesList!: QueryList<ElementRef<HTMLElement>>;

  @ViewChild("timelineBackground")
  timelineBackgroundRef!: ElementRef<HTMLElement>;

  @ViewChild("timelineLine")
  timelineLineRef!: ElementRef<HTMLElement>;

  @ViewChild("timelineSvg")
  timelineSvgRef!: ElementRef<SVGElement>;

  @ViewChild("timelinePath")
  timelinePathRef!: ElementRef<SVGPathElement>;

  @ViewChild("timelineGradientPath")
  timelineGradientPathRef!: ElementRef<SVGPathElement>;

  @Input("orientation")
  orientation: "left" | "right" | "switch" = "left";

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

  @Input("pathWidth")
  set pathWidth(pathWidth: string) {
    this.style["--om-timeline-path-width"] = pathWidth;
  }

  @Input("titleMaxWidth")
  set titleMaxWidth(titleMaxWidth: string) {
    this.style["--om-timeline-entry-title-max-width"] = titleMaxWidth;
  }

  @Input("pathColor")
  set pathColorValue(pathColor: string) {
    this.pathColor = pathColor;
    this.style["--om-timeline-path-color"] = pathColor;
  }

  @Input("gradientColors")
  set gradientColors(gradientColors: string[]) {
    if (gradientColors.length !== 2) {
      return;
    }

    this.gradientStart = gradientColors[0];
    this.gradientEnd = gradientColors[1];

    this.style["--om-timeline-gradient-start"] = this.gradientStart;
    this.style["--om-timeline-gradient-end"] = this.gradientEnd;
  }

  gradientStart = "#3b82f6";
  gradientEnd = "#7f00ff";
  pathColor = "#e2e8f0";

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

  constructor(
    private readonly sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

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
    if (this.orientation != "switch") {
      const rect = this.wrapperRef.nativeElement.getBoundingClientRect();
      this.timelineBackgroundRef.nativeElement.style.height = `${rect.height}px`;
    } else {
      this.updateSvgPath();
    }
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

    if (this.orientation === "switch") {
      let progress = topPosition / (rect.height - scrollHeight);

      if (progress >= 1) {
        progress = 1;
      } else if (progress <= 0) {
        progress = 0;
      }

      const length =
        this.timelineGradientPathRef.nativeElement.getTotalLength();

      this.timelineGradientPathRef.nativeElement.style.strokeDasharray = `${length}`;
      this.timelineGradientPathRef.nativeElement.style.strokeDashoffset = `${
        length * (1 - progress)
      }`;

      return;
    }

    let progress = topPosition / rect.height;

    if (topPosition >= rect.height || progress >= 1) {
      this.timelineLineRef.nativeElement.style.height = `${rect.height}px`;
      return;
    }

    this.timelineLineRef.nativeElement.style.height = `${
      progress * rect.height + scrollHeight * 0.5
    }px`;
  }

  updateSvgPath(): void {
    const path = this.calculateSvgPath();
    const wrapperRect = this.wrapperRef.nativeElement.getBoundingClientRect();
    this.timelineSvgRef.nativeElement.setAttribute(
      "width",
      `${wrapperRect.width - 20}`
    );
    this.timelineSvgRef.nativeElement.setAttribute(
      "height",
      `${wrapperRect.height}`
    );
    this.timelinePathRef.nativeElement.setAttribute("d", path);
    this.timelineGradientPathRef.nativeElement.setAttribute("d", path);
  }

  calculateSvgPath(): string {
    const entries = this.entriesList.toArray();
    let path = "";

    // Adjust the control point extensions based on screen size
    const isMobile = window.innerWidth <= 1000;
    const curveExtension = isMobile ? 200 : 500; // Shorter curve extensions on mobile

    for (let i = 0; i < entries.length; i++) {
      const entryRect = entries[i].nativeElement.getBoundingClientRect();
      const wrapperRect = this.wrapperRef.nativeElement.getBoundingClientRect();
      const startX = i % 2 === 0 ? 0 : wrapperRect.width - 40; // Start from 0px or the right side
      const endX = i % 2 === 0 ? wrapperRect.width - 40 : 0; // End at the opposite side
      const startY = entryRect.top - wrapperRect.top;
      const endY = entryRect.bottom - wrapperRect.top;

      if (i === 0) {
        // Move to the starting point of the first entry, by 10rem (100px) above it
        path += `M${startX},${startY - 160}`;
      }

      // Extend the straight line slightly before starting the curve
      const extendedY = endY + 10;

      // Draw the extended straight line
      path += ` L${startX},${extendedY}`;

      if (i < entries.length - 1) {
        const nextEntryRect =
          entries[i + 1].nativeElement.getBoundingClientRect();
        const nextStartY = nextEntryRect.top - wrapperRect.top;

        const controlPointY1 = extendedY + curveExtension; // Adjusted control points for mobile
        const controlPointY2 = nextStartY - curveExtension;

        // S-shaped curve with adjusted control points for smoother transition on mobile
        path += ` C${startX},${controlPointY1} ${endX},${controlPointY2} ${endX},${nextStartY}`;
      } else {
        // End the path with a straight line at the last entry, but extend it by 10rem (160px)
        path += ` L${startX},${endY + 160}`;
      }
    }

    return path;
  }
}
