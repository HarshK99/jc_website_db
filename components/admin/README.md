# Admin Components

This directory contains reusable components for admin forms across the application.

## Components

### TitleInput
A styled title input field with large text formatting.

```tsx
import { TitleInput } from './admin';

<TitleInput
  value={title}
  onChange={setTitle}
  placeholder="Add title"
  required={true}
/>
```

### ContentInput
A styled textarea for content input.

```tsx
import { ContentInput } from './admin';

<ContentInput
  value={content}
  onChange={setContent}
  placeholder="Write the content here..."
  required={true}
  rows={12}
/>
```

### SlugInput
A slug input field with helper text.

```tsx
import { SlugInput } from './admin';

<SlugInput
  value={slug}
  onChange={setSlug}
  placeholder="url-friendly-slug"
  required={true}
/>
```

### ImageUpload
An image upload component with preview and drag-and-drop interface.

```tsx
import { ImageUpload } from './admin';

<ImageUpload
  imagePreview={imagePreview}
  onImageSelect={handleImageSelect}
  onRemoveImage={handleRemoveImage}
  folder="content-type"
  disabled={false}
/>
```

### PublishDateInput
A datetime-local input for publish dates.

```tsx
import { PublishDateInput } from './admin';

<PublishDateInput
  value={publishedAt}
  onChange={setPublishedAt}
  label="Publish Date & Time"
/>
```

### CheckboxField
A checkbox field for boolean values like featured/recommended.

```tsx
import { CheckboxField } from './admin';

<CheckboxField
  checked={isFeatured}
  onChange={setIsFeatured}
  label="Featured Item"
  title="Settings"
/>
```

### TagsInput
A tags input component with add/remove functionality.

```tsx
import { TagsInput } from './admin';

<TagsInput
  tags={tags}
  onChange={setTags}
  placeholder="Add a tag and press Enter"
/>
```

## Usage in Forms

Import all components from the index:

```tsx
import {
  TitleInput,
  ContentInput,
  SlugInput,
  ImageUpload,
  PublishDateInput,
  CheckboxField,
  TagsInput
} from './admin';
```

## Benefits

- **Consistency**: All admin forms use the same styling and behavior
- **Maintainability**: Changes to component styling/behavior apply everywhere
- **Reusability**: Easy to add new admin forms with existing components
- **Type Safety**: All components are properly typed with TypeScript