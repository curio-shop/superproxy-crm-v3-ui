import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Dropdown from './Dropdown';

interface TemplateSettings {
  logoSize: 'small' | 'medium' | 'large' | 'custom';
  logoPosition: 'left' | 'center' | 'right';
  logoVisibility: 'visible' | 'hidden';
  cornerStyle: 'sharp' | 'rounded' | 'pill';
  colorEffect: 'plain' | 'gradient' | 'duotone';
  colorTheme: string;
  fontFamily: string;
  sectionTitleSize: number;
  bodyFontSize: string;
  lineHeight: 'tight' | 'normal' | 'relaxed';
  pageMargins: 'narrow' | 'normal' | 'wide' | 'custom';
  sectionSpacing: 'compact' | 'balanced' | 'spacious';
  borderStyle: 'none' | 'light' | 'medium' | 'heavy';
  rowPadding: 'tight' | 'normal' | 'relaxed';
  headerBackgroundOpacity: number;
  pageSize: 'a4' | 'letter' | 'legal';
  pageOrientation: 'portrait' | 'landscape';
  enableWatermark: boolean;
  watermarkText: string;
  termsText: string;
  acceptanceText: string;
  signatureFields: string[];
  customColumns: Array<{ id: string; name: string }>;
  customSections: Array<{ id: string; title: string; content: string }>;
}

interface CollapsibleSectionProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ icon, title, description, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon icon={icon} width="22" className="text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>
        <Icon
          icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
          width="20"
          className="text-slate-400 flex-shrink-0"
        />
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
};

const colorThemes = [
  { name: 'Ocean Blue', color: '#3b82f6', value: 'ocean' },
  { name: 'Deep Navy', color: '#1e40af', value: 'navy' },
  { name: 'Midnight', color: '#1e293b', value: 'midnight' },
  { name: 'Forest Green', color: '#059669', value: 'forest' },
  { name: 'Emerald', color: '#10b981', value: 'emerald' },
  { name: 'Energy Orange', color: '#ea580c', value: 'orange' },
  { name: 'Amber', color: '#f59e0b', value: 'amber' },
  { name: 'Crimson', color: '#dc2626', value: 'crimson' },
  { name: 'Rose', color: '#e11d48', value: 'rose' },
  { name: 'Violet', color: '#7c3aed', value: 'violet' },
  { name: 'Teal', color: '#0d9488', value: 'teal' },
  { name: 'Cyan', color: '#06b6d4', value: 'cyan' },
  { name: 'Slate', color: '#475569', value: 'slate' },
  { name: 'Charcoal', color: '#374151', value: 'charcoal' },
  { name: 'Bronze', color: '#92400e', value: 'bronze' },
  { name: 'Burgundy', color: '#881337', value: 'burgundy' },
];

const defaultTerms = `Scope of Quotation

This quote includes a detailed summary of product specifications, itemized pricing, installation fees, and delivery charges, with additional information as stated above. The quote is subject to modification based on client requirements, adjustments, or specifications requested.

A shop drawing will be developed once the project is awarded to Rocco Furnishing International Ltd. Co. This drawing will be submitted to the client for review, and any necessary adjustments will be made in collaboration with them.

Rocco Furnishing International Ltd. Co. offers complimentary ocular visits and cost estimates as part of our services.`;

const defaultAcceptance = `Enter the acceptance text that will appear above the signature fields. If left empty, a default text will be used.`;

interface TemplateBuilderProps {
  onClose?: () => void;
  templateType?: 'quotation' | 'invoice';
}

export default function TemplateBuilder({ onClose, templateType }: TemplateBuilderProps = {}) {
  const [settings, setSettings] = useState<TemplateSettings>({
    logoSize: 'large',
    logoPosition: 'right',
    logoVisibility: 'visible',
    cornerStyle: 'rounded',
    colorEffect: 'plain',
    colorTheme: 'midnight',
    fontFamily: 'Inter',
    sectionTitleSize: 100,
    bodyFontSize: '13px',
    lineHeight: 'normal',
    pageMargins: 'normal',
    sectionSpacing: 'balanced',
    borderStyle: 'light',
    rowPadding: 'normal',
    headerBackgroundOpacity: 100,
    pageSize: 'a4',
    pageOrientation: 'portrait',
    enableWatermark: false,
    watermarkText: 'DRAFT',
    termsText: defaultTerms,
    acceptanceText: defaultAcceptance,
    signatureFields: [],
    customColumns: [],
    customSections: [],
  });

  const [previewMode, setPreviewMode] = useState<'quotation' | 'invoice'>(templateType || 'quotation');

  const updateSetting = <K extends keyof TemplateSettings>(key: K, value: TemplateSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getThemeColor = () => {
    const theme = colorThemes.find((t) => t.value === settings.colorTheme);
    return theme?.color || '#475569';
  };

  const addSignatureField = () => {
    const newField = `Signatory ${settings.signatureFields.length + 1}`;
    updateSetting('signatureFields', [...settings.signatureFields, newField]);
  };

  const removeSignatureField = (index: number) => {
    updateSetting(
      'signatureFields',
      settings.signatureFields.filter((_, i) => i !== index)
    );
  };

  const handleSaveTemplate = () => {
    // Here you would typically save the settings to localStorage or backend
    // Close the template builder and return to previous page
    if (onClose) {
      onClose();
    }
  };

  const content = (
      <div className={`${onClose ? '' : 'h-full'} flex flex-col bg-slate-50 ${onClose ? 'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {onClose && (
            <>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
              >
                <Icon icon="solar:arrow-left-linear" width="20" />
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
            </>
          )}
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase text-blue-600 mb-1">
              <span>Template Settings</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Template Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:bg-slate-100 hover:text-slate-900 transition-all focus:ring-2 focus:ring-slate-200 focus:outline-none active:scale-[0.98] text-sm font-medium text-slate-600 bg-white h-10 border border-slate-200 rounded-lg px-5">
            Reset to Default
          </button>
          <button 
            onClick={handleSaveTemplate}
            className="group h-10 flex items-center gap-2 px-5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none active:scale-[0.98]"
          >
            <span>Save Template</span>
            <Icon
              icon="solar:check-circle-linear"
              className="group-hover:scale-110 transition-transform"
              width="16"
            />
          </button>
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Settings */}
        <div className="w-[520px] border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar flex-shrink-0">
          {/* Styling & Format Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm border border-blue-200 flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold" width="22" className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Styling & Format</h2>
                <p className="text-xs text-slate-600">Customize branding, colors, fonts, typography, etc., for your quotation templates.</p>
              </div>
            </div>
          </div>

          <CollapsibleSection
            icon="solar:gallery-linear"
            title="Logo & Branding"
            description="Customize the appearance and branding of your logo."
          >
            <div className="space-y-6">
              {/* Logo Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Logo Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {['small', 'medium', 'large', 'custom'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('logoSize', size as any)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        settings.logoSize === size
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Logo Position */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-3">Logo Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'left', icon: 'solar:align-left-linear', label: 'Left' },
                      { value: 'center', icon: 'solar:align-horizontal-center-linear', label: 'Center' },
                      { value: 'right', icon: 'solar:align-right-linear', label: 'Right' },
                    ].map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => updateSetting('logoPosition', pos.value as any)}
                        className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                          settings.logoPosition === pos.value
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                        title={pos.label}
                      >
                        <Icon icon={pos.icon} width="16" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo Visibility */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-3">Logo Visibility</label>
                  <Dropdown
                    value={settings.logoVisibility}
                    options={[
                      { value: 'visible', label: 'Visible' },
                      { value: 'hidden', label: 'Hidden' },
                    ]}
                    onChange={(value) => updateSetting('logoVisibility', value as any)}
                    className="w-full"
                    buttonClassName="w-full"
                    menuClassName="w-full"
                    menuAlign="left"
                  />
                </div>
              </div>

              {/* Corner Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Corner Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'sharp', label: 'Sharp', icon: 'solar:square-linear' },
                    { value: 'rounded', label: 'Rounded', icon: 'solar:square-linear' },
                    { value: 'pill', label: 'Pill', icon: 'solar:panorama-horizontal-linear' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updateSetting('cornerStyle', style.value as any)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        settings.cornerStyle === style.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon icon={style.icon} width="14" />
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:palette-outline"
            title="Template Color Theme"
            description="Choose a color palette and style for your quotation template."
          >
            <div className="space-y-6">
              {/* Color Effect */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Color Effect</label>
                <Dropdown
                  value={settings.colorEffect}
                  options={[
                    { value: 'plain', label: 'Plain Color' },
                    { value: 'gradient', label: 'Gradient Effect' },
                  ]}
                  onChange={(value) => updateSetting('colorEffect', value as any)}
                  className="w-full"
                  buttonClassName="w-full"
                  menuClassName="w-full"
                  menuAlign="left"
                />
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Color Theme</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateSetting('colorTheme', theme.value)}
                      className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                        settings.colorTheme === theme.value
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      title={theme.name}
                    >
                      <div
                        className="w-full h-10 rounded-md shadow-sm"
                        style={{ backgroundColor: theme.color }}
                      ></div>
                      <p className="text-[10px] font-medium text-slate-700 text-center leading-tight line-clamp-1 w-full">{theme.name}</p>
                      {settings.colorTheme === theme.value && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white">
                          <Icon icon="solar:check-linear" width="10" className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:text-linear"
            title="Template Font"
            description="Select a font family for your template. This will be applied to all text in quotations."
          >
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Font Family</label>
                <Dropdown
                  value={settings.fontFamily}
                  options={[
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Montserrat', label: 'Montserrat' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Open Sans', label: 'Open Sans' },
                    { value: 'Lato', label: 'Lato' },
                    { value: 'Poppins', label: 'Poppins' },
                  ]}
                  onChange={(value) => updateSetting('fontFamily', value as string)}
                  className="w-full"
                  buttonClassName="w-full"
                  menuClassName="w-full"
                  menuAlign="left"
                />
              </div>

              {/* Font Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Selected Font Preview:</label>
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <h2 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: settings.fontFamily }}>
                    {settings.fontFamily}
                  </h2>
                  <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: settings.fontFamily }}>
                    QUOTATION #Q-2024-001
                  </p>
                  <p className="text-xs text-slate-500" style={{ fontFamily: settings.fontFamily }}>
                    This is how your text will look with the selected font.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:text-field-linear"
            title="Typography & Spacing"
            description="Fine-tune text sizes, spacing, and layout margins for perfect readability."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Section Title Size */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-semibold text-slate-900">Section Title Size</label>
                    <span className="text-xs font-semibold text-blue-600">{settings.sectionTitleSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="120"
                    value={settings.sectionTitleSize}
                    onChange={(e) => updateSetting('sectionTitleSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>80% (Small)</span>
                    <span>100% (Default)</span>
                    <span>120% (Large)</span>
                  </div>
                </div>

                {/* Body Font Size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-3">Body Font Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['11px', '12px', '13px', '14px'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting('bodyFontSize', size)}
                        className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          settings.bodyFontSize === size
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Line Height */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-3">Line Height</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'tight', label: 'Tight', sub: '1.4' },
                      { value: 'normal', label: 'Normal', sub: '1.6' },
                      { value: 'relaxed', label: 'Relaxed', sub: '1.8' },
                    ].map((height) => (
                      <button
                        key={height.value}
                        onClick={() => updateSetting('lineHeight', height.value as any)}
                        className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          settings.lineHeight === height.value
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>{height.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{height.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Margins */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-3">Page Margins</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['narrow', 'normal', 'wide', 'custom'].map((margin) => (
                      <button
                        key={margin}
                        onClick={() => updateSetting('pageMargins', margin as any)}
                        className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                          settings.pageMargins === margin
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {margin.charAt(0).toUpperCase() + margin.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section Spacing */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Section Spacing</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'compact', label: 'Compact', sub: 'Tight spacing' },
                    { value: 'balanced', label: 'Balanced', sub: 'Default spacing' },
                    { value: 'spacious', label: 'Spacious', sub: 'Generous spacing' },
                  ].map((spacing) => (
                    <button
                      key={spacing.value}
                      onClick={() => updateSetting('sectionSpacing', spacing.value as any)}
                      className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${
                        settings.sectionSpacing === spacing.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>{spacing.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">{spacing.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:widget-4-linear"
            title="Table Styling"
            description="Customize the appearance of tables in your quotations."
          >
            <div className="space-y-6">
              {/* Border Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Border Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {['none', 'light', 'medium', 'heavy'].map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting('borderStyle', style as any)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        settings.borderStyle === style
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row Padding */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Row Padding</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'tight', label: 'Tight', sub: '8px padding' },
                    { value: 'normal', label: 'Normal', sub: '12px padding' },
                    { value: 'relaxed', label: 'Relaxed', sub: '16px padding' },
                  ].map((padding) => (
                    <button
                      key={padding.value}
                      onClick={() => updateSetting('rowPadding', padding.value as any)}
                      className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${
                        settings.rowPadding === padding.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>{padding.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">{padding.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Opacity */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-slate-900">Header Background Opacity</label>
                  <span className="text-xs font-semibold text-blue-600">{settings.headerBackgroundOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.headerBackgroundOpacity}
                  onChange={(e) => updateSetting('headerBackgroundOpacity', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                  <span>0% (Transparent)</span>
                  <span>50%</span>
                  <span>100% (Solid)</span>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:document-text-linear"
            title="Terms & Acceptance"
            description="Define the terms, conditions, and acceptance details for your quotations"
          >
            <div className="space-y-6">
              {/* Terms and Condition */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Terms and Condition</label>
                <textarea
                  value={settings.termsText}
                  onChange={(e) => updateSetting('termsText', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-3 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono leading-relaxed"
                  placeholder="Enter your terms and conditions..."
                />
              </div>

              {/* Acceptance of Quotation Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Acceptance of Quotation Text</label>
                <textarea
                  value={settings.acceptanceText}
                  onChange={(e) => updateSetting('acceptanceText', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-3 rounded-lg border border-slate-200 text-xs text-slate-500 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter the acceptance text that will appear above the signature fields..."
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:pen-linear"
            title="Additional Signature Fields"
            description="Add additional signatories to your quotation documents"
            defaultOpen={false}
          >
            <div className="space-y-4">
              {settings.signatureFields.length > 0 && (
                <div className="space-y-2">
                  {settings.signatureFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <span className="text-xs font-semibold text-slate-700">{field}</span>
                      <button
                        onClick={() => removeSignatureField(index)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Icon icon="solar:trash-bin-minimalistic-linear" width="16" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addSignatureField}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
              >
                <Icon icon="solar:add-circle-linear" width="18" className="text-slate-400 group-hover:text-blue-600" />
                Add Signatory Field
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:widget-2-linear"
            title="Column Management"
            description="Manage table columns for your quotations"
            defaultOpen={false}
          >
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all group">
                <Icon icon="solar:add-circle-linear" width="18" className="text-slate-400 group-hover:text-blue-600" />
                Add New Column
              </button>

              <div className="p-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                <p className="text-xs text-slate-500">
                  No custom columns yet. Click "Add New Column" to create one.
                </p>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:document-add-linear"
            title="Custom Section Builder"
            description="Add custom content blocks to your quotations"
            defaultOpen={false}
          >
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all group">
                <Icon icon="solar:add-circle-linear" width="18" className="text-slate-400 group-hover:text-blue-600" />
                Add Custom Section
              </button>

              <div className="p-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                <p className="text-xs text-slate-500">
                  No custom sections yet. Click "Add Custom Section" to create one.
                </p>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="solar:settings-linear"
            title="Advanced Settings"
            description="Professional features for PDF export and document customization."
            defaultOpen={false}
          >
            <div className="space-y-6">
              {/* Page Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Page Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'a4', label: 'A4', sub: '8.27 in × 11.69 in' },
                    { value: 'letter', label: 'Letter', sub: '8.5 × 11 in' },
                    { value: 'legal', label: 'Legal', sub: '8.5 × 14 in' },
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updateSetting('pageSize', size.value as any)}
                      className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${
                        settings.pageSize === size.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>{size.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-normal">{size.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Orientation */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Page Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'portrait', icon: 'solar:smartphone-linear', label: 'Portrait' },
                    { value: 'landscape', icon: 'solar:tablet-linear', label: 'Landscape' },
                  ].map((orientation) => (
                    <button
                      key={orientation.value}
                      onClick={() => updateSetting('pageOrientation', orientation.value as any)}
                      className={`px-4 py-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        settings.pageOrientation === orientation.value
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon icon={orientation.icon} width="18" />
                      {orientation.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Watermark */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-3">Add Watermark</label>
                <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enableWatermark}
                    onChange={(e) => updateSetting('enableWatermark', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Enable Watermark</div>
                    <div className="text-xs text-slate-500 mt-0.5">Add watermark text to your quotations</div>
                  </div>
                </label>

                {settings.enableWatermark && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-900 mb-2">Watermark Text</label>
                    <input
                      type="text"
                      value={settings.watermarkText}
                      onChange={(e) => updateSetting('watermarkText', e.target.value)}
                      placeholder="Enter watermark text..."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-slate-100/80 relative overflow-hidden">
          {/* Floating Preview Badge */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-full px-4 py-2.5 shadow-lg flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Icon icon="solar:eye-linear" width="16" className="text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">Live Preview</span>
              </div>
              {!templateType && (
                <>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-0.5">
                    <button
                      onClick={() => setPreviewMode('quotation')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        previewMode === 'quotation'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Quotation
                    </button>
                    <button
                      onClick={() => setPreviewMode('invoice')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        previewMode === 'invoice'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Invoice
                    </button>
                  </div>
                </>
              )}
              {templateType && (
                <>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <span className="text-xs font-semibold text-slate-900 capitalize">
                    {templateType} Template
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 overflow-y-auto flex flex-col pt-24 pr-8 pb-20 pl-8 items-center justify-start custom-scrollbar">
            <div
              className="relative w-full max-w-[210mm] min-h-[297mm] bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 origin-top"
              style={{
                fontFamily: settings.fontFamily,
              }}
            >
              <div className="p-[12mm] md:p-[15mm] space-y-10">
                {/* Logo */}
                {settings.logoVisibility === 'visible' && (
                  <div
                    className={`${
                      settings.logoPosition === 'center'
                        ? 'flex justify-center'
                        : settings.logoPosition === 'right'
                        ? 'flex justify-end'
                        : ''
                    }`}
                  >
                    <div
                      className={`bg-slate-100 flex items-center justify-center ${
                        settings.cornerStyle === 'pill'
                          ? 'rounded-full'
                          : settings.cornerStyle === 'rounded'
                          ? 'rounded-xl'
                          : ''
                      } ${
                        settings.logoSize === 'small'
                          ? 'w-16 h-16'
                          : settings.logoSize === 'medium'
                          ? 'w-20 h-20'
                          : settings.logoSize === 'large'
                          ? 'w-24 h-24'
                          : 'w-32 h-32'
                      }`}
                    >
                      <Icon icon="solar:magic-stick-3-linear" width="28" className="text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Document Header */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100/50">
                  <h1
                    className="font-semibold tracking-tight mb-4"
                    style={{
                      fontSize: `${(24 * settings.sectionTitleSize) / 100}px`,
                      color: getThemeColor(),
                    }}
                  >
                    {previewMode === 'quotation' ? 'QUOTATION' : 'INVOICE'}
                  </h1>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">client name</p>
                      <p className="text-xs font-semibold text-slate-900">Acme Corporation</p>
                      <p className="text-xs text-slate-600">123 Business Street</p>
                      <p className="text-xs text-slate-600">New York, NY 10001</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">Date:</span> Jan 16, 2026
                      </p>
                      <p className="text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">
                          {previewMode === 'quotation' ? 'Valid Until:' : 'Due Date:'}
                        </span>{' '}
                        Feb 15, 2026
                      </p>
                      <p className="text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">Reference:</span>{' '}
                        {previewMode === 'quotation' ? 'QT-2024-001' : 'INV-2024-001'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">What we offer:</h3>
                  <div className="w-full border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div
                      className={`grid grid-cols-12 gap-4 p-3 font-semibold uppercase tracking-wider text-[10px] ${
                        settings.borderStyle === 'none'
                          ? ''
                          : settings.borderStyle === 'light'
                          ? 'border-b'
                          : settings.borderStyle === 'medium'
                          ? 'border-b-2'
                          : 'border-b-4'
                      } border-slate-200`}
                      style={{
                        backgroundColor: `rgba(241, 245, 249, ${settings.headerBackgroundOpacity / 100})`,
                        color: settings.headerBackgroundOpacity > 50 ? '#1e293b' : '#64748b',
                      }}
                    >
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>
                    <div className="bg-white divide-y divide-slate-100">
                      {[
                        { name: 'Premium Widget', qty: 5, price: 150.0 },
                        { name: 'Professional Service', qty: 10, price: 75.0 },
                        { name: 'Installation Fee', qty: 1, price: 500.0 },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-12 gap-4 text-slate-700 ${
                            settings.rowPadding === 'tight'
                              ? 'p-2'
                              : settings.rowPadding === 'normal'
                              ? 'p-3'
                              : 'p-4'
                          }`}
                          style={{ fontSize: settings.bodyFontSize }}
                        >
                          <div className="col-span-6">
                            <p className="font-semibold text-slate-900">{item.name}</p>
                          </div>
                          <div className="col-span-2 text-center font-medium">{item.qty}</div>
                          <div className="col-span-2 text-right font-medium">${item.price.toFixed(2)}</div>
                          <div className="col-span-2 text-right font-bold text-slate-900">
                            ${(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-end pt-2">
                    <div className="w-1/2 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Subtotal</span>
                        <span>$2,000.00</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Tax (10%)</span>
                        <span>$200.00</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total</span>
                        <span>$2,200.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>Created from Superproxy.ai</span>
                <span>Page 1 of 1</span>
              </div>

              {/* Watermark */}
              {settings.enableWatermark && settings.watermarkText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
                  <span className="text-9xl font-bold text-slate-900 transform -rotate-45">
                    {settings.watermarkText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <>
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out"
            onClick={onClose}
            style={{
              animation: 'fadeIn 300ms ease-out'
            }}
          />
          {content}
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </>
    );
  }

  return content;
}
