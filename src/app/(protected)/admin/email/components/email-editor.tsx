"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  NotepadTextIcon as Paragraph,
} from "lucide-react"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("visual")
  const [htmlValue, setHtmlValue] = useState(value)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleContentChange = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      onChange(newValue)
      setHtmlValue(newValue)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "visual" && editorRef.current) {
      editorRef.current.innerHTML = htmlValue
    }
  }

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="bg-muted p-2 border-b">
          <TabsList>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="p-0">
          <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
            <Button variant="ghost" size="icon" onClick={() => execCommand("bold")} className="h-8 w-8">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("italic")} className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("underline")} className="h-8 w-8">
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-px h-8 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => execCommand("justifyLeft")} className="h-8 w-8">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("justifyCenter")} className="h-8 w-8">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("justifyRight")} className="h-8 w-8">
              <AlignRight className="h-4 w-4" />
            </Button>
            <div className="w-px h-8 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => execCommand("insertUnorderedList")} className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("insertOrderedList")} className="h-8 w-8">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="w-px h-8 bg-border mx-1"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const url = prompt("Enter URL:")
                if (url) execCommand("createLink", url)
              }}
              className="h-8 w-8"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const url = prompt("Enter image URL:")
                if (url) execCommand("insertImage", url)
              }}
              className="h-8 w-8"
            >
              <Image className="h-4 w-4" />
            </Button>
            <div className="w-px h-8 bg-border mx-1"></div>
            <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h1>")} className="h-8 w-8">
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h2>")} className="h-8 w-8">
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h3>")} className="h-8 w-8">
              <Heading3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<p>")} className="h-8 w-8">
              <Paragraph className="h-4 w-4" />
            </Button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] p-4 focus:outline-none"
            onInput={handleContentChange}
            onBlur={handleContentChange}
          />
        </TabsContent>

        <TabsContent value="html" className="p-0">
          <textarea
            className="min-h-[400px] w-full p-4 font-mono text-sm focus:outline-none"
            value={htmlValue}
            onChange={handleHtmlChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

