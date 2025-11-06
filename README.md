# ngx-timeline

<a href="https://ngxui.com" target="_blank" style="display: flex;gap: .5rem;align-items: center;cursor: pointer; padding: 0 0 0 0; height: fit-content;">
  <img src="https://ngxui.com/assets/img/ngxui-logo.png" style="width: 64px;height: 64px;">
</a>

This Library is part of the NGXUI ecosystem. <br>
View all available components at https://ngxui.com

`@omnedia/ngx-timeline` is an Angular component that helps you create elegant and responsive timelines. It offers
dynamic scrolling effects, customizable orientation, and flexible styling options to fit your needs. Whether you're
showcasing a sequence of events, project milestones, or any chronological content, this component makes it simple and
stylish.

## Features

- Dynamic Timelines: Automatically adjusts and animates based on the scroll position.
- Flexible Orientation: Supports both left and right orientation for timelines.
- Customizable Styling: Fine-tune gaps between entries, titles, and contents with CSS variables.
- Responsive Design: Optimized for all screen sizes.

## Installation

Install the library using npm:

```bash
npm install @omnedia/ngx-timeline
```

## Usage

Import the `NgxTimelineComponent` and `NgxTimelineEntryComponent` in your Angular module or component:

```typescript
import { NgxTimelineComponent, NgxTimelineEntryComponent } from '@omnedia/ngx-timeline';

@Component({
    ...
        imports:
[
    ...
        NgxTimelineComponent, NgxTimelineEntryComponent
],
...
})

export class YourComponent {
}
```

Use the component in your template:

```html

<om-timeline
  [orientation]="'left'"
  [entriesGap]="'4rem'"
  [entryGap]="'2rem'"
  [titleGap]="'1.5rem'"
  styleClass="custom-timeline"
>
  <om-timeline-entry>
    <ng-template #timelineTitle><p>Start</p></ng-template>
    <ng-template #timelineContent>
      <div>The beginning of the project.</div>
    </ng-template>
  </om-timeline-entry>

  <om-timeline-entry>
    <ng-template #timelineTitle><p>Development</p></ng-template>
    <ng-template #timelineContent>
      <div>Key milestones achieved.</div>
    </ng-template>
  </om-timeline-entry>

  <om-timeline-entry>
    <ng-template #timelineTitle><p>Launch</p></ng-template>
    <ng-template #timelineContent>
      <div>The project goes live!</div>
    </ng-template>
  </om-timeline-entry>
</om-timeline>
```

## How It Works

- Timeline Structure: The component organizes your content into a vertical timeline. Each entry is a combination of a
  title and content.
- Scroll Animation: As the user scrolls, the timeline line animates, giving a visual indication of progress through the
  timeline.
- Orientation: Display the timeline on either the left or right side of the content, depending on your design
  preference.

## API

```html

<om-timeline
  [orientation]="orientation"
  [entriesGap]="entriesGap"
  [entryGap]="entryGap"
  [titleGap]="titleGap"
  [titleMaxWidth]="titleMaxWidth"
  [pathWidth]="pathWidth"
  [pathColor]="pathColor"
  [gradientColors]="gradientColors"
  styleClass="your-custom-class"
>
  <om-timeline-entry>
    <ng-template #timelineTitle>Title template</ng-template>
    <ng-template #timelineContent>Content template</ng-template>
  </om-timeline-entry>
</om-timeline>
```

- `orientation` (optional): Defines the alignment of the timeline entries. Accepts 'left', 'right', or 'switch'. Default
  is 'left'.
- `entriesGap` (optional): Defines the gap between timeline entries. Accepts any valid CSS size value. Default is '
  5rem'.
- `entryGap` (optional): Defines the gap between the title and content within an entry. Accepts any valid CSS size
  value. Default is '4rem'.
- `titleGap` (optional): Defines the gap between the circle and the title within an entry. Accepts any valid CSS size
  value. Default is '2rem'.
- `titleMaxWidth` (optional): Defines the max width of the title elements. Default is '25rem'.
- `pathWidth` (optional): Defines the width of the timeline path. Accepts any valid CSS size value. Default is '2px'.
- `pathColor` (optional): Defines the colors of the timeline path. Accepts an array of two CSS color values for the
  path. Default is '#e2e8f0'.
- `gradientColors` (optional): Defines the colors for the gradient on the path. Accepts an array of two CSS color
  values. Default is ['#3b82f6', '#7f00ff'].
- `styleClass` (optional): Custom CSS class to apply to the component.

## Example

```html

<om-timeline
  [orientation]="'right'"
  styleClass="example-timeline"
>
  <om-timeline-entry>
    <ng-template #timelineTitle><p>Start</p></ng-template>
    <ng-template #timelineContent>
      <div>The beginning of the project.</div>
    </ng-template>
  </om-timeline-entry>

  <om-timeline-entry>
    <ng-template #timelineTitle><p>Development</p></ng-template>
    <ng-template #timelineContent>
      <div>Key milestones achieved.</div>
    </ng-template>
  </om-timeline-entry>

  <om-timeline-entry>
    <ng-template #timelineTitle><p>Launch</p></ng-template>
    <ng-template #timelineContent>
      <div>The project goes live!</div>
    </ng-template>
  </om-timeline-entry>
</om-timeline>
```

This example shows a right-aligned timeline with your entries.

## Styling

```html

<om-timeline styleClass="custom-timeline">
  <om-timeline-entry>
    <ng-template #timelineTitle><p class="timeline-title">Start</p></ng-template>
    <ng-template #timelineContent>
      <div class="timeline-content">The beginning of the project.</div>
    </ng-template>
  </om-timeline-entry>
</om-timeline>
```

```css
/* Component Styling */
.timeline-title, .timeline-content {
    font-size: 2rem;
    color: white;
}

.timeline-title {
    font-weight: bold;
}

/* Global Styling */
.custom-timeline .om-timeline-entry-header .om-timeline-circle {
    background-color: #4caf50;
}
```

This CSS customizes the color of the timeline circles and sets some text styling for the title and content.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.
