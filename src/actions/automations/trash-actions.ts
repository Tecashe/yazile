"use server"

import { onCurrentUser } from "../user"
import {
  moveToTrashQuery,
  getTrashedAutomations,
  restoreAutomationQuery,
  permanentlyDeleteAutomationQuery,
  emptyTrashQuery,
} from "./trash-queries"

export const moveToTrash = async (automationId: string) => {
  const user = await onCurrentUser()
  try {
    const moved = await moveToTrashQuery(automationId)
    if (moved) {
      return { status: 200, data: "Automation moved to trash" }
    }
    return { status: 404, data: "Automation not found" }
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" }
  }
}

export const getAllTrashedAutomations = async () => {
  const user = await onCurrentUser()
  try {
    const automations = await getTrashedAutomations(user.id)
    if (automations) return { status: 200, data: automations.automations }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 500, data: [] }
  }
}

export const restoreAutomation = async (automationId: string) => {
  await onCurrentUser()
  try {
    const restored = await restoreAutomationQuery(automationId)
    if (restored) {
      return { status: 200, data: "Automation restored successfully" }
    }
    return { status: 404, data: "Automation not found" }
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" }
  }
}

export const permanentlyDeleteAutomation = async (automationId: string) => {
  await onCurrentUser()
  try {
    const deleted = await permanentlyDeleteAutomationQuery(automationId)
    if (deleted) {
      return { status: 200, data: "Automation permanently deleted" }
    }
    return { status: 404, data: "Automation not found" }
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" }
  }
}

export const emptyTrash = async () => {
  const user = await onCurrentUser()
  try {
    const result = await emptyTrashQuery(user.id)
    if (result) {
      return { status: 200, data: `${result.count} automation(s) permanently deleted` }
    }
    return { status: 404, data: "No automations in trash" }
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" }
  }
}
