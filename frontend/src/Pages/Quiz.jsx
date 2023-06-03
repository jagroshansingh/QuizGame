import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import styles from "./css/Quiz.module.css";
import { Single } from "../Components/Single";

export const Quiz = () => {
  const { id } = useParams();
  const [current, setCurrent] = React.useState(0);
  const [allquestions, setAllQuestions] = React.useState([]);
  const [remember, setRemember] = React.useState([]);
  const [score,setScore]=React.useState(0)
  console.log(score)


  const handlePage = (e) => {
    if(e.target.innerText=='Submit')
    {
      const {player}=JSON.parse(localStorage.getItem('quiz'))
      axios({
        method:'post',
        url:`${process.env.REACT_APP_URL}/score/push`,
        data:{player,score}
      })
      .then(res=>console.log(res.data))
      .catch(err=>console.log(err))
    }
    else setCurrent((prev) => (e.target.innerText == "Next" ? prev + 1 : prev - 1));
  };

  const handleOption = (e) => {
    
    setRemember([...remember, e.target.innerText]);
    if(allquestions[current].correctOption==e.target.innerText) setScore((prev)=>prev+1)
    
  };

  React.useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/quiz/single`,
      headers: { id },
    })
      .then((res) => setAllQuestions(res.data[0].questionBank))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.quizBody}>
      <Box className={styles.quizContainer}>
        {allquestions.length == 0 ? (
          <Heading>Loading...</Heading>
        ) : (
          <Box>
            <Single
              allq={allquestions}
              handleOption={handleOption}
              remember={remember}
              current={current}
            />
            <Box className={styles.buttonContainer}>
              <Button
                isDisabled={current == 0 ? true : false}
                onClick={handlePage}
              >
                Prev
              </Button>
              <Button onClick={handlePage}>
                {current + 1 == allquestions.length ? "Submit" : "Next"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};
