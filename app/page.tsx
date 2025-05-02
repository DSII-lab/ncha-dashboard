'use client';

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

import { getData, getQuestions, getSubQuestions } from "./api/getData";
import { parsePrompt } from "./api/parseGPT";
import ViewedQuestion from "@/constant/types/viewedQuestion";
import Chart from "./components/chart";
import { SearchIcon } from "./components/searchIcon";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const [questions, setQuestions] = useState<any>({});
  const [subquestions, setSubquestions] = useState<any>({});
  const [selectedDataYear, setSelectedDataYear] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [selectedSubquestion, setSelectedSubquestion] = useState<any>(null);
  const [selectedDemoGroup, setSelectedDemoGroup] = useState<any>(null);
  const [viewedQuestions, setViewedQuestions] = useState<ViewedQuestion[]>([]);
  const [gptPrompt, setGptPrompt] = useState<string>('');
  const [isLoadingGptPrompt, setIsLoadingGptPrompt] = useState<boolean>(false);

  const DEMO_GROUP = [
    {
      label: 'Total',
      key: 'total'
    },
    {
      label: 'Age',
      key: 'N3Q69'
    },
    {
      label: 'Class Year',
      key: 'N3Q72'
    },
    {
      label: 'GPA',
      key: 'N3Q80'
    },
    {
      label: 'Gender',
      key: 'N3Q67C'
    },
    {
      label: 'Sexual Orientation',
      key: 'N3Q68'
    },
    {
      label: 'Relationship Status',
      key: 'N3Q76'
    }
  ]

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const data = await getData();
    setData(data);
    console.log(data);

    const questions = await getQuestions();
    setQuestions(questions);
    console.log(questions);

    const subquestions = await getSubQuestions();
    setSubquestions(subquestions);
    console.log(subquestions);

    setIsLoading(false);
  }

  function fixViewedQuestion(viewedQuestion: ViewedQuestion) {
    if (viewedQuestion.dataYear === 'Fall 2024') {
      if (['N3Q2B', 'N3Q2C', 'N3Q2D'].includes(viewedQuestion.subquestionKey)) {
        viewedQuestion.subquestionKey = 'R' + viewedQuestion.subquestionKey
      }
    }

    return viewedQuestion;
  }

  function onSelectQuestion(val: any) {
    setSelectedQuestion(val);
    setSelectedSubquestion(null);
  }

  function onPressAddBtn() {
    if (!selectedDataYear || !selectedDemoGroup || !selectedQuestion) {
      alert('All fields are required.');
      return;
    }

    if (selectedQuestion in subquestions) {
      if (!selectedSubquestion) {
        alert('All fields are required.');
        return;
      }

      setViewedQuestions([{
        dataYear: selectedDataYear,
        questionKey: selectedQuestion,
        questionName: subquestions[selectedQuestion][selectedSubquestion],
        subquestionKey: selectedSubquestion,
        demoGroupKey: selectedDemoGroup
      }, ...viewedQuestions])
    } else {
      setViewedQuestions([{
        dataYear: selectedDataYear,
        questionKey: selectedQuestion,
        questionName: questions[selectedQuestion],
        subquestionKey: null,
        demoGroupKey: selectedDemoGroup
      }, ...viewedQuestions])
    }
  }

  async function parseGPT() {
    if (gptPrompt.length === 0) {
      alert('Search prompt is required.');
      return;
    }

    setIsLoadingGptPrompt(true);
    const result = await parsePrompt(gptPrompt);

    console.log(result);
    setIsLoadingGptPrompt(false);

    if (result.status === 1) {
      alert('Backend error: ' + result.msg);
      return;
    }

    const promptData = result.data;

    if (!Object.keys(data).includes(promptData.year) || !Object.keys(questions).includes(promptData.questionId) || (promptData.subquestionId !== null && !Object.keys(subquestions[promptData.questionId]).includes(promptData.subquestionId))) {
      alert('Unable to parse the prompt.');
      return;
    }

    let demoGroup = '';
    for (let i = 0; i < DEMO_GROUP.length; i++) {
      if (DEMO_GROUP[i].label.toUpperCase() === promptData.demoGroup.toUpperCase()) {
        demoGroup = DEMO_GROUP[i].key;
      }
    }
    if (demoGroup.length === 0) {
      alert('Unable to parse the prompt.');
      return;
    }

    setViewedQuestions([{
      dataYear: promptData.year,
      questionKey: promptData.questionId,
      questionName: promptData.subquestionId ? subquestions[promptData.questionId][promptData.subquestionId] : questions[promptData.questionId],
      subquestionKey: promptData.subquestionId,
      demoGroupKey: demoGroup
    }, ...viewedQuestions])
  }

  return (
    <div className="flex flex-col w-full justify-center items-center py-6">
      <h1 className="text-3xl font-semibold">NCHA Survey Dashboard</h1>
      {
        isLoading ? (
          <div className="mt-10">
            Loading survey data...
          </div>
        ) : (
          <div className="flex w-full flex-col">
            <div className="w-full mt-10 flex px-12 gap-4">
              <div className="flex-1">
                <Input
                  isClearable
                  label="Ask anything"
                  placeholder="e.g. How many Brandeis students are overweight?"
                  value={gptPrompt}
                  onValueChange={setGptPrompt}
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <Button size="lg" color="primary" isDisabled={isLoadingGptPrompt} onPress={parseGPT}>{isLoadingGptPrompt ? 'Loading...' : 'Add'}</Button>
            </div>
            <div className="w-full text-center mb-4 mt-4 text-lg font-bold">
              OR
            </div>
            <div className="flex w-full px-12 gap-4 justify-center items-center">
              <div className="w-36">
                <Autocomplete label="Year" onSelectionChange={setSelectedDataYear}>
                  {Object.keys(data).sort((a: string, b: string) => {
                    if (a < b) {
                      return 1;
                    }
                    if (a > b) {
                      return -1;
                    }
                    return 0;
                  }).map((data) => (
                    <SelectItem key={data}>{data}</SelectItem>
                  ))}
                </Autocomplete>
              </div>
              <div className="flex-1">
                <Autocomplete itemHeight={60} onSelectionChange={onSelectQuestion} fullWidth label="Question">
                  {Object.keys(questions).map((questionId) => (
                    <AutocompleteItem key={questionId}>
                      {questionId + ': ' + questions[questionId]}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              {
                (selectedQuestion in subquestions) && (
                  <div className="flex-1">
                    <Autocomplete fullWidth label="Subquestion" onSelectionChange={setSelectedSubquestion} selectedKey={selectedSubquestion}>
                      {
                        Object.keys(subquestions[selectedQuestion]).map((questionId) => (
                          <AutocompleteItem key={questionId}>
                            {questionId + ': ' + subquestions[selectedQuestion][questionId]}
                          </AutocompleteItem>
                        ))
                      }
                    </Autocomplete>
                  </div>
                )
              }
              <div className="w-44">
                <Autocomplete label="Demographic group" onSelectionChange={setSelectedDemoGroup}>
                  {DEMO_GROUP.map((demo) => (
                    <AutocompleteItem key={demo.key}>{demo.label}</AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <Button size="lg" color="primary" onPress={onPressAddBtn}>Add</Button>
            </div>
          </div>
        )
      }
      <div className="w-full mx-24 justify-center items-center flex gap-14 pt-20 flex-wrap">
        {
          viewedQuestions.map((viewedQuestion: ViewedQuestion, index: number) => {
            return (
              <div className="w-5/6 shadow-md p-5 rounded-lg border-1" key={viewedQuestion.dataYear + viewedQuestion.demoGroupKey + viewedQuestion.questionKey + (viewedQuestion.subquestionKey ? viewedQuestion.subquestionKey : 'no subquestion') + index}>
                <Chart data={data[viewedQuestion.dataYear]} viewedQuestion={fixViewedQuestion(viewedQuestion)} onClose={() => {
                  setViewedQuestions(viewedQuestions.filter((val: ViewedQuestion, i: number) => index !== i));
                }} />
              </div>
            )
          })
        }
      </div>
    </div >
  )
}
