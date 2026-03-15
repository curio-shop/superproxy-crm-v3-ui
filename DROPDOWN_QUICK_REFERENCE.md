# Dropdown Component - Quick Reference Guide

## 🚀 Quick Start

```tsx
import Dropdown from './Dropdown';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <Dropdown
      value={value}
      options={['Option 1', 'Option 2', 'Option 3']}
      onChange={(val) => setValue(val as string)}
      placeholder="Select an option"
    />
  );
}
```

---

## 📋 Props API Reference

### Basic Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string \| string[]` | ✅ Yes | - | Current selected value(s) |
| `options` | `DropdownOption[] \| string[]` | ✅ Yes | - | List of options |
| `onChange` | `(value: string \| string[]) => void` | ✅ Yes | - | Callback when value changes |
| `placeholder` | `string` | ❌ No | `'Select...'` | Placeholder text |

### Enhanced Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `searchable` | `boolean` | ❌ No | `false` | Enable search functionality |
| `multiSelect` | `boolean` | ❌ No | `false` | Enable multi-selection |
| `disabled` | `boolean` | ❌ No | `false` | Disable the dropdown |
| `error` | `boolean` | ❌ No | `false` | Show error state |
| `icon` | `string` | ❌ No | - | Iconify icon name for button |
| `label` | `string` | ❌ No | - | Label text before value |

### Styling Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | `string` | ❌ No | `''` | Container className |
| `buttonClassName` | `string` | ❌ No | `''` | Button className override |
| `menuClassName` | `string` | ❌ No | `''` | Menu className override |

### Advanced Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `renderOption` | `(option, isSelected) => ReactNode` | ❌ No | - | Custom option renderer |
| `renderValue` | `(selected) => ReactNode` | ❌ No | - | Custom value renderer |

---

## 🎯 Common Use Cases

### 1. Simple Dropdown
```tsx
<Dropdown
  value={category}
  options={['Electronics', 'Footwear', 'Apparel']}
  onChange={(val) => setCategory(val as string)}
  placeholder="Select category"
/>
```

### 2. Dropdown with Search
```tsx
<Dropdown
  value={country}
  options={['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France']}
  onChange={(val) => setCountry(val as string)}
  searchable
  placeholder="Search country..."
/>
```

### 3. Dropdown with Icons
```tsx
<Dropdown
  value={currency}
  options={currencies}
  onChange={setCurrency}
  icon="solar:dollar-minimalistic-linear"
  label="Currency:"
/>
```

### 4. Dropdown with Rich Options
```tsx
const options = [
  { 
    value: 'usd', 
    label: 'US Dollar',
    icon: 'circle-flags:us',
    subtext: 'United States'
  },
  { 
    value: 'eur', 
    label: 'Euro',
    icon: 'circle-flags:eu',
    subtext: 'European Union'
  }
];

<Dropdown
  value={selectedCurrency}
  options={options}
  onChange={setSelectedCurrency}
  searchable
/>
```

### 5. Multi-Select Dropdown
```tsx
<Dropdown
  value={selectedTags}
  options={['React', 'TypeScript', 'Next.js', 'Tailwind']}
  onChange={(vals) => setSelectedTags(vals as string[])}
  multiSelect
  placeholder="Select technologies..."
/>
```

### 6. Dropdown with Error State
```tsx
<Dropdown
  value={status}
  options={['Active', 'Inactive', 'Pending']}
  onChange={setStatus}
  error={!status}
  placeholder="Status is required"
/>
```

### 7. Disabled Dropdown
```tsx
<Dropdown
  value={lockedValue}
  options={['Option 1', 'Option 2']}
  onChange={() => {}}
  disabled
/>
```

### 8. Full-Width Dropdown
```tsx
<Dropdown
  value={value}
  options={options}
  onChange={setValue}
  className="w-full"
  buttonClassName="w-full"
  menuClassName="w-full"
/>
```

### 9. Compact Dropdown (Custom Height)
```tsx
<Dropdown
  value={value}
  options={options}
  onChange={setValue}
  buttonClassName="h-[38px] px-2"
/>
```

### 10. Custom Option Rendering
```tsx
<Dropdown
  value={user}
  options={users}
  onChange={setUser}
  renderOption={(option, isSelected) => (
    <div className="flex items-center gap-3">
      <img src={option.avatar} className="w-8 h-8 rounded-full" />
      <div>
        <p className="font-semibold">{option.label}</p>
        <p className="text-xs text-slate-400">{option.email}</p>
      </div>
      {isSelected && <Icon icon="solar:check-circle-bold" />}
    </div>
  )}
/>
```

---

## 🎨 Styling Guidelines

### Default Styling (Matches ScopeFilter)
The dropdown comes with beautiful default styling. No additional classes needed!

```tsx
// This is all you need for consistent design:
<Dropdown value={val} options={opts} onChange={setVal} />
```

### Custom Styling Examples

#### Full Width in Forms
```tsx
<div className="space-y-1.5">
  <label className="text-xs font-semibold text-slate-500">Category</label>
  <Dropdown
    value={category}
    options={categories}
    onChange={setCategory}
    className="w-full"
  />
</div>
```

#### Inline with Other Elements
```tsx
<div className="flex items-center gap-2">
  <span>Filter by:</span>
  <Dropdown
    value={filter}
    options={filterOptions}
    onChange={setFilter}
  />
</div>
```

#### Custom Button Height
```tsx
<Dropdown
  value={value}
  options={options}
  onChange={setValue}
  buttonClassName="h-[36px]"  // Smaller height
/>
```

---

## 🔧 TypeScript Types

### DropdownOption Interface
```typescript
interface DropdownOption {
  value: string;
  label: string;
  icon?: string;           // Iconify icon name
  disabled?: boolean;      // Disable this option
  subtext?: string;        // Additional context text
}
```

### Usage with TypeScript
```typescript
import Dropdown, { DropdownOption } from './Dropdown';

// String array options
const stringOptions = ['Option 1', 'Option 2'];

// Rich options
const richOptions: DropdownOption[] = [
  { value: 'opt1', label: 'Option 1', icon: 'solar:check-linear' },
  { value: 'opt2', label: 'Option 2', disabled: true }
];

// Single select
const [value, setValue] = useState<string>('');

// Multi select
const [values, setValues] = useState<string[]>([]);
```

---

## ✅ Best Practices

### DO ✅
- Use searchable for dropdowns with 10+ options
- Provide meaningful placeholder text
- Use icons for visual hierarchy
- Keep option labels concise
- Use subtext for additional context
- Handle empty states gracefully

### DON'T ❌
- Don't use for 2-3 options (use radio buttons instead)
- Don't make the dropdown too wide (max 400px recommended)
- Don't use both icon and label unnecessarily
- Don't forget to handle loading states
- Don't use multi-select for many options (use a different UI)

---

## 🐛 Common Issues & Solutions

### Issue: Dropdown not closing on outside click
**Solution**: Ensure the dropdown is not inside another element with `stopPropagation()`

### Issue: Dropdown menu cut off by container
**Solution**: Ensure parent containers don't have `overflow: hidden` or use a portal

### Issue: Search not working
**Solution**: Make sure `searchable={true}` prop is set

### Issue: Value not updating
**Solution**: Ensure `onChange` is properly updating state:
```tsx
// ❌ Wrong
<Dropdown onChange={setValue} />

// ✅ Correct
<Dropdown onChange={(val) => setValue(val as string)} />
```

### Issue: TypeScript errors with value type
**Solution**: Cast the value in onChange:
```tsx
onChange={(val) => setValue(val as string)}
// or for multi-select:
onChange={(vals) => setValues(vals as string[])}
```

---

## 🎭 State Management Examples

### With Local State
```tsx
function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <Dropdown
      value={value}
      options={['A', 'B', 'C']}
      onChange={(v) => setValue(v as string)}
    />
  );
}
```

### With Form Libraries (e.g., React Hook Form)
```tsx
import { Controller } from 'react-hook-form';

<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Dropdown
      value={field.value}
      options={categories}
      onChange={(val) => field.onChange(val)}
      error={!!errors.category}
    />
  )}
/>
```

### With URL State (e.g., Search Params)
```tsx
const [searchParams, setSearchParams] = useSearchParams();
const filter = searchParams.get('filter') || '';

<Dropdown
  value={filter}
  options={filterOptions}
  onChange={(val) => {
    setSearchParams({ filter: val as string });
  }}
/>
```

---

## 🚦 Accessibility Notes

The component includes basic accessibility features:
- Semantic HTML structure
- Click-outside-to-close
- Keyboard focus management
- Proper button roles

**Future Enhancements** (not yet implemented):
- Arrow key navigation
- ARIA labels and roles
- Screen reader announcements
- Escape key to close

---

## 📚 Related Components

- **ScopeFilter**: Specialized dropdown for data scope (All/Team/Personal)
- **SortDropdown**: Specialized dropdown for sorting with icons
- **CurrencyDropdown**: Currency selector (uses light theme now!)

---

## 📞 Need Help?

- Check the examples in this guide
- View `DROPDOWN_STANDARDIZATION_SUMMARY.md` for implementation details
- View `DROPDOWN_VISUAL_COMPARISON.md` for before/after visuals
- Look at existing usage in:
  - `AddProductDrawer.tsx`
  - `AddCompanyDrawer.tsx`
  - `AddContactDrawer.tsx`
  - `TemplateBuilder.tsx`
  - `Header.tsx`

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
