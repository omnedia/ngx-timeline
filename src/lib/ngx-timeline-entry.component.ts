import { Component, ContentChild, TemplateRef } from "@angular/core";

@Component({
    selector: 'om-timeline-entry',
    template: '',
    standalone: true,
})
export class NgxTimelineEntryComponent {
    @ContentChild('timelineTitle', {read: TemplateRef}) titleTpl!: TemplateRef<any>;
    @ContentChild('timelineContent', {read: TemplateRef}) contentTpl!: TemplateRef<any>;
}
