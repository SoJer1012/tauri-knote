import { IList } from "@/types";
import { handleIsTauri } from ".";
import {
  exists,
  readTextFile,
  BaseDirectory,
  writeTextFile,
  createDir,
  renameFile,
} from "@tauri-apps/api/fs";

const ROOT_FOLDER_NAME = "kNote";
const PLAN_FILE_NAME = "planList.json";

// 创建项目缓存根目录
export async function createRootFolder() {
  try {
    const isExist = await exists(ROOT_FOLDER_NAME, {
      dir: BaseDirectory.Download,
    });
    if (!isExist) {
      await createDir(ROOT_FOLDER_NAME, {
        dir: BaseDirectory.Download,
        recursive: true,
      });
    }
  } catch (error) {}
}

// 从文件中读取计划列表内容
export async function loadPlans() {
  if (!handleIsTauri())
    return localStorage.getItem("planList")
      ? JSON.parse(localStorage.getItem("planList") ?? "")
      : {};
  try {
    await createRootFolder();
    const isExist = await exists(`${ROOT_FOLDER_NAME}/${PLAN_FILE_NAME}`, {
      dir: BaseDirectory.Download,
    });
    if (!isExist) {
      await writeTextFile(`${ROOT_FOLDER_NAME}/${PLAN_FILE_NAME}`, "{}", {
        dir: BaseDirectory.Download,
      });
    }
    const data = await readTextFile(`${ROOT_FOLDER_NAME}/${PLAN_FILE_NAME}`, {
      dir: BaseDirectory.Download,
    });
    return JSON.parse(data) ?? {};
  } catch (error: any) {
    if (error?.message?.includes("File not found")) {
      return {};
    }
    throw error;
  }
}

// 向文件中写入计划内容
export async function savePlans(plans: IList) {
  if (!handleIsTauri()) {
    localStorage.setItem(PLAN_FILE_NAME, JSON.stringify(plans));
    return;
  }
  await writeTextFile(
    `${ROOT_FOLDER_NAME}/${PLAN_FILE_NAME}`,
    JSON.stringify(plans),
    {
      dir: BaseDirectory.Download,
    }
  );
}

// 从映射文件中读取笔记列表
export async function loadNotes() {
  if (!handleIsTauri()) return;
  try {
    await createRootFolder();
    const isExistMapping = await exists(
      `${ROOT_FOLDER_NAME}/noteMapping.json`,
      {
        dir: BaseDirectory.Download,
      }
    );
    if (!isExistMapping) {
      await writeTextFile(`${ROOT_FOLDER_NAME}/noteMapping.json`, "{}", {
        dir: BaseDirectory.Download,
      });
    }
    const data = await readTextFile(`${ROOT_FOLDER_NAME}/noteMapping.json`, {
      dir: BaseDirectory.Download,
    });
    return JSON.parse(data) ?? {};
  } catch (error: any) {
    // 文件不存在时返回空对象
    if (error?.message?.includes("File not found")) {
      return {};
    }
    throw error;
  }
}

// 更新映射文件
export async function saveNotesMapping(mapping: any) {
  if (!handleIsTauri()) {
    return;
  }
  await writeTextFile(
    `${ROOT_FOLDER_NAME}/noteMapping.json`,
    JSON.stringify({ data: mapping }),
    {
      dir: BaseDirectory.Download,
    }
  );
}

// 读取笔记内容
export async function findNoteContent(fileId: string) {
  if (!handleIsTauri()) {
    return "";
  }
  try {
    const isExistFile = await exists(`${ROOT_FOLDER_NAME}/${fileId}.md`, {
      dir: BaseDirectory.Download,
    });
    if (!isExistFile) {
      await writeTextFile(`${ROOT_FOLDER_NAME}/${fileId}.md`, "", {
        dir: BaseDirectory.Download,
      });
      return "";
    } else {
      const data = await readTextFile(`${ROOT_FOLDER_NAME}/${fileId}.md`, {
        dir: BaseDirectory.Download,
      });
      return data;
    }
  } catch (error: any) {
    if (error?.message?.includes("File not found")) {
      return "";
    }
    throw error;
  }
}

// 写入笔记内容
export async function saveNoteContent(filename: string, content: string) {
  if (!handleIsTauri()) {
    return;
  }
  try {
    await writeTextFile(`${ROOT_FOLDER_NAME}/${filename}.md`, content, {
      dir: BaseDirectory.Download,
    });
  } catch (error) {}
}

export async function renameNote(oldFilename: string, filename: string) {
  if (!handleIsTauri()) {
    return;
  }
  try {
    await renameFile(
      `${ROOT_FOLDER_NAME}/${oldFilename}.md`,
      `${ROOT_FOLDER_NAME}/${filename}.md`,
      {
        dir: BaseDirectory.AppData,
      }
    );
  } catch (error) {}
}
