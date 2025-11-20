import {
  Component,
  signal,
  computed,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Option {
  value: string | number;
  label: string;
}

export type SelectValue = Option | Option[] | null;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select-field.html',
})
export class SelectField {
  /* ---------------- Inputs ---------------- */
  @Input() options: Option[] = [];
  @Input() label = '';
  @Input() placeholder = 'انتخاب کنید';
  @Input() errorMessage = '';
  @Input() className = '';
  @Input() containerClassName = '';
  @Input() showSelectAll = false;
  @Input() selectAllText = 'انتخاب همه';
  @Input() deselectAllText = 'لغو همه';
  @Input() searchable = false;
  @Input() maxDisplayNum = 3;
  @Input() multiple = false;
  @Input() width = '';

  /* ---------------- Value as a signal ---------------- */
  private _value = signal<SelectValue>(null);

  @Input()
  set value(v: SelectValue) {
    this._value.set(v);
  }

  get value(): SelectValue {
    return this._value();
  }

  @Output() valueChange = new EventEmitter<SelectValue>();

  /* ---------------- Local reactive state ---------------- */
  query = signal('');
  open = signal(false);
  focused = signal(false);

  constructor(private host: ElementRef<HTMLElement>) {}

  /* ---------------- Computeds ---------------- */
  filteredOptions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!this.searchable || q === '') return this.options;
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  });

  buttonText = computed(() => {
    if (this.multiple) {
      const selected = (this._value() as Option[]) || [];
      if (selected.length === 0) return this.placeholder;
      if (selected.length === 1) return selected[0].label;
      if (selected.length <= this.maxDisplayNum) {
        return selected.map((s) => s.label).join('، ');
      }
      return `${selected.length} آیتم انتخاب شد`;
    }
    const selected = this._value() as Option | null;
    return selected?.label ?? this.placeholder;
  });

  areAllSelected(): boolean {
    if (!this.multiple) return false;
    const selected = (this._value() as Option[]) || [];
    return selected.length === this.options.length && this.options.length > 0;
  }

  /* ---------------- Actions ---------------- */
  toggleOpen() {
    this.open.update((v) => !v);
    if (!this.open()) this.query.set('');
  }

  close() {
    this.open.set(false);
    this.query.set('');
    this.focused.set(false);
  }

  toggleOption(option: Option) {
    if (this.multiple) {
      const selected = ((this._value() as Option[]) || []).slice();
      const idx = selected.findIndex((s) => s.value === option.value);
      if (idx >= 0) selected.splice(idx, 1);
      else selected.push(option);

      this._value.set([...selected]);
      this.valueChange.emit([...selected]);
    } else {
      this._value.set({ ...option });
      this.valueChange.emit({ ...option });
      this.close();
    }
  }

  handleSelectAll() {
    if (!this.multiple) return;
    if (this.areAllSelected()) {
      this._value.set([]);
      this.valueChange.emit([]);
    } else {
      const copy = this.options.slice();
      this._value.set(copy);
      this.valueChange.emit(copy);
    }
  }

  isSelected(option: Option): boolean {
    if (this.multiple) {
      const selected = (this._value() as Option[]) || [];
      return selected.some((s) => s.value === option.value);
    }
    const selected = this._value() as Option | null;
    return selected?.value === option.value;
  }

  /* ---------------- Accessibility / Click Outside ---------------- */
  @HostListener('document:click', ['$event'])
  onDocClick(evt: MouseEvent) {
    const target = evt.target as Node;
    if (!this.host.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(_evt: Event) {
    this.close();
  }

  onQueryKeydown(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.close();
  }
}
