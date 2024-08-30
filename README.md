# ngx-timeline

`@omnedia/ngx-timeline` is an Angular component that helps you create elegant and responsive timelines. It offers dynamic scrolling effects, customizable orientation, and flexible styling options to fit your needs. Whether you're showcasing a sequence of events, project milestones, or any chronological content, this component makes it simple and stylish.

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

Import the `NgxTimelineComponent` in your Angular module or component:

```typescript
import { NgxTimelineComponent } from '@omnedia/ngx-timeline';

@Component({
  ...
  imports: [
    ...
    NgxTimelineComponent,
  ],
  ...
})
export class YourComponent {}
```

Use the component in your template:

```html
<om-timeline
  [orientation]="'left'"
  [data]="timelineEntries"
  [entriesGap]="'4rem'"
  [entryGap]="'2rem'"
  [titleGap]="'1.5rem'"
  styleClass="custom-timeline"
></om-timeline>
```

## Data Structure

The data input expects an array of objects representing the timeline entries. Each entry should have a title and content property. Both values can be html code.

```typescript
const timelineEntries: TimelineEntry[] = [
  {
    title: '<p>Start</p>',
    content: '<div>The beginning of the project.<div>',
  },
  {
    title: '<p>Development</p>',
    content: 'Key development milestones achieved.',
  },
  {
    title: '<p>Launch</p>',
    content: '<div>The project goes live!</div>',
  },
];
```

## How It Works

- Timeline Structure: The component organizes your content into a vertical timeline. Each entry is a combination of a title and content.
- Scroll Animation: As the user scrolls, the timeline line animates, giving a visual indication of progress through the timeline.
- Orientation: Display the timeline on either the left or right side of the content, depending on your design preference.

## API

```html
<om-timeline
  [orientation]="orientation"
  [data]="data"
  [entriesGap]="entriesGap"
  [entryGap]="entryGap"
  [titleGap]="titleGap"
  [titleMaxWidth]="titleMaxWidth"
  [pathWidth]="pathWidth"
  [pathColor]="pathColor"
  [gradientColors]="gradientColors"
  styleClass="your-custom-class"
></om-timeline>
```

- `data` (required): An array of timeline entries. Each entry must include a title and content.
- `orientation` (optional): Defines the alignment of the timeline entries. Accepts 'left', 'right', or 'switch'. Default is 'left'.
- `entriesGap` (optional): Defines the gap between timeline entries. Accepts any valid CSS size value. Default is '5rem'.
- `entryGap` (optional): Defines the gap between the title and content within an entry. Accepts any valid CSS size value. Default is '4rem'.
- `titleGap` (optional): Defines the gap between the circle and the title within an entry. Accepts any valid CSS size value. Default is '2rem'.
- `titleMaxWidth` (optional): Defines the max width of the title elements. Default is '25rem'.
- `pathWidth` (optional): Defines the width of the timeline path. Accepts any valid CSS size value. Default is '2px'.
- `pathColor` (optional): Defines the colors of the timeline path. Accepts an array of two CSS color values for the path. Default is '#e2e8f0'.
- `gradientColors` (optional): Defines the colors for the gradient on the path. Accepts an array of two CSS color values. Default is ['#3b82f6', '#7f00ff'].
- `styleClass` (optional): Custom CSS class to apply to the component.

## Example

```html
<om-timeline
  [orientation]="'right'"
  [data]="[
    { title: 'Step 1', content: 'Initial planning phase.' },
    { title: 'Step 2', content: 'Development in progress.' },
    { title: 'Step 3', content: 'Final review and launch.' }
  ]"
  styleClass="example-timeline"
></om-timeline>
```

This example shows a right-aligned timeline with custom data.

## Styling
```typescript
const timelineEntries: TimelineEntry[] = [
  {
    title: '<p class="timeline-title">Start</p>',
    content: '<div class="timeline-content">The beginning of the project.<div>',
  },
    ...
];
```

```html
<om-timeline styleClass="custom-timeline" [data]="timelineEntries"></om-timeline>
```

```css
/* Component Styling */
.timeline-title, .timeline-content {
    font-size: 2rem;
    color: white;
}

.timeline-title {
    font-weight: blod;
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