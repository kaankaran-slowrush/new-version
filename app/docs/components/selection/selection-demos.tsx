"use client";

import * as React from "react";
import { ImageIcon, Music, Type, Video } from "lucide-react";
import {
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedControl,
  Slider,
  Switch,
} from "@/components/primitives";

/* Interactive specimens. Split into a client component so the docs page itself
   stays a server component — a server component cannot pass the event handlers
   these controls require. */

export function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  const [off, setOff] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Switch checked={on} onCheckedChange={setOn} label="Notify on completion" />
      <Switch
        checked={off}
        onCheckedChange={setOff}
        label="Weekly digest"
        description="A summary of runs and spend across the workspace."
      />
      <Switch checked disabled label="Locked by workspace policy" />
    </div>
  );
}

export function SegmentedDemo() {
  const [mode, setMode] = React.useState("image");
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        label="Output type"
        value={mode}
        onValueChange={setMode}
        options={[
          { value: "text", label: "Text", icon: <Type /> },
          { value: "image", label: "Image", icon: <ImageIcon /> },
          { value: "video", label: "Video", icon: <Video /> },
          { value: "audio", label: "Audio", icon: <Music /> },
        ]}
      />
      <SegmentedControl
        label="View mode"
        size="sm"
        value={mode === "text" ? "text" : "other"}
        onValueChange={() => {}}
        options={[
          { value: "text", label: "List" },
          { value: "other", label: "Grid" },
          { value: "disabled", label: "Timeline", disabled: true },
        ]}
      />
    </div>
  );
}

export function SliderDemo() {
  const [steps, setSteps] = React.useState(30);
  return (
    <div className="w-full max-w-sm">
      <Slider
        label="Steps"
        value={steps}
        onValueChange={(v) => setSteps(Array.isArray(v) ? v[0]! : v)}
        min={10}
        max={60}
        step={1}
      />
    </div>
  );
}

export function CheckboxDemo() {
  const [checked, setChecked] = React.useState<string[]>(["completed"]);
  const toggle = (v: string) =>
    setChecked((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );

  return (
    <div className="flex flex-col gap-1">
      {[
        { v: "completed", label: "Model completed", hint: "Fires when a model finishes successfully" },
        { v: "started", label: "Model started", hint: "Fires when a model begins processing" },
        { v: "failed", label: "Model failed", hint: "Fires when a model fails to process" },
      ].map((item) => (
        <label
          key={item.v}
          className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-surface-hover"
        >
          <Checkbox
            className="mt-0.5"
            checked={checked.includes(item.v)}
            onCheckedChange={() => toggle(item.v)}
          />
          <span>
            <span className="block text-sm font-medium text-ink">{item.label}</span>
            <span className="block text-sm text-ink-tertiary">{item.hint}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function RadioDemo() {
  const [value, setValue] = React.useState("workspace");
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(String(v))}>
      <div className="flex flex-col gap-2">
        {[
          { v: "private", label: "Private" },
          { v: "workspace", label: "Workspace" },
          { v: "public", label: "Public link" },
        ].map((item) => (
          <label key={item.v} className="flex cursor-pointer items-center gap-2.5">
            <Radio value={item.v} />
            <span className="text-sm text-ink">{item.label}</span>
          </label>
        ))}
      </div>
    </RadioGroup>
  );
}
