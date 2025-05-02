'use server';

import loadData from "@/app/_utils/loadData";
import { QUESTION_LIST, SUBQUESTION_LIST } from "@/constant/questions";

export async function getData() {
  return await loadData();
}

export async function getQuestions() {
  return QUESTION_LIST;
}

export async function getSubQuestions() {
  return SUBQUESTION_LIST;
}