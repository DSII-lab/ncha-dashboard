import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'react-chartjs-2';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn } from '@heroui/table';

import ViewedQuestion from '@/constant/types/viewedQuestion';

export default function Chart({
  data,
  viewedQuestion,
  onClose
}: {
  data: any,
  viewedQuestion: ViewedQuestion,
  onClose: () => void
}) {
  const [isShowChart, setIsShowChart] = useState<boolean>(true);
  const [labelsArr, setLabelsArr] = useState<string[]>([]);
  const [newDataObj, setNewDataObj] = useState<any>({});
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [question, setQuestion] = useState<string>(viewedQuestion.subquestionKey ? viewedQuestion.subquestionKey : viewedQuestion.questionKey);

  useEffect(() => {
    let newData: any = {};
    let labels: string[] = [];
    let totalResponses = 0;

    console.log(JSON.stringify(viewedQuestion))

    setQuestion(viewedQuestion.subquestionKey ? viewedQuestion.subquestionKey : viewedQuestion.questionKey)

    if (viewedQuestion.demoGroupKey === 'total') {
      for (let i = 0; i < data.length; i++) {
        const thisData = data[i];
        if (question in thisData && thisData[question] !== '') {
          totalResponses++;
          if (!(thisData[question] in newData)) {
            newData[thisData[question]] = {};
            newData[thisData[question]][thisData[question]] = 1;
          } else {
            newData[thisData[question]][thisData[question]]++;
          }
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        const thisData = data[i];
        if (question in thisData && thisData[question] !== '' && viewedQuestion.demoGroupKey in thisData && thisData[viewedQuestion.demoGroupKey] !== '') {
          totalResponses++;
          if (!(thisData[question] in newData)) {
            newData[thisData[question]] = {};
          }
          if (!(thisData[viewedQuestion.demoGroupKey] in newData[thisData[question]])) {
            if (!labels.includes(thisData[viewedQuestion.demoGroupKey])) {
              labels.push(thisData[viewedQuestion.demoGroupKey]);
            }
            newData[thisData[question]][thisData[viewedQuestion.demoGroupKey]] = 1;
          } else {
            newData[thisData[question]][thisData[viewedQuestion.demoGroupKey]]++;
          }
        }
      }
    }

    // sort data
    labels = labels.sort();
    const keys = Object.keys(newData).sort();
    const oldData = newData;
    newData = {};
    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = oldData[keys[i]];
    }

    // fill data
    for (let i in newData) {
      for (let j = 0; j < labels.length; j++) {
        if (!(labels[j] in newData[i])) {
          newData[i][labels[j]] = 0;
        }
      }
    }

    console.log(JSON.stringify(labels));
    console.log(JSON.stringify(newData));

    setNewDataObj(newData);
    setLabelsArr(labels);
    setTotalResponses(totalResponses);
  }, [viewedQuestion.dataYear, viewedQuestion.demoGroupKey, viewedQuestion.questionKey, viewedQuestion.subquestionKey ? 'no subquestion' : viewedQuestion.subquestionKey])

  function DataTable() {
    if (viewedQuestion.demoGroupKey === 'total') {
      return (
        <Table className='mt-2'>
          <TableHeader>
            <TableColumn>{question}</TableColumn>
            <TableColumn>Total</TableColumn>
          </TableHeader>
          <TableBody>
            {
              Object.keys(newDataObj).map((key: string) => {
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{newDataObj[key][key]}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      )
    }

    return (
      <Table className='mt-2'>
        <TableHeader>
          {
            [question, ...labelsArr].map((label: string) => {
              return (
                <TableColumn>{label}</TableColumn>
              )
            })
          }
        </TableHeader>
        <TableBody>
          {
            Object.keys(newDataObj).map((key: string) => {
              return (
                <TableRow key={key}>
                  {
                    [key, ...Object.keys(newDataObj[key])].map((x: string, index: number) => {
                      return (
                        <>
                          {
                            index === 0 ? (<TableCell key={x}>{x}</TableCell>) : (<TableCell key={x}>{newDataObj[key][x]}</TableCell>)
                          }
                        </>
                      )
                    })
                  }
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  return (
    <div>
      <div className="flex mb-2 justify-end gap-4">
        <Button onPress={() => {
          setIsShowChart(!isShowChart);
        }}>
          {isShowChart ? 'Table' : 'Chart'}
        </Button>
        <Button color="danger" onPress={onClose}>Close</Button>
      </div>
      <p className='text-sm'>{viewedQuestion.dataYear} - {viewedQuestion.questionName}</p>
      <p className='text-sm'>Total responses: {totalResponses}</p>
      {
        isShowChart ? (
          <ChartJS type='bar' data={{
            labels: labelsArr,
            datasets: Object.keys(newDataObj).map((key: string) => {
              return {
                label: key,
                data: Object.keys(newDataObj[key]).map((x: string) => {
                  return {
                    x,
                    y: newDataObj[key][x]
                  }
                })
              }
            })
          }} />
        ) : (
          <DataTable />
        )
      }
    </div>
  )
}