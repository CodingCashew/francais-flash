import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./CardContainer";
import "./DeckMenu";
import { prettyDeckLabels } from "./DeckMenu";

export default function EditCard({
  setEditingCard,
  currentDeck,
  currentCard,
  getCards,
}) {
  const id = currentCard.id;
  const [values, setValues] = useState({
    sentence_with_blank: "",
    sentence: "",
    synonyms: "",
    infinitive: "",
    word: "",
    definition: "",
    locked: false,
    id: id,
  });

  useEffect(() => {
    setValues(currentCard);
  }, [currentCard]);

  const handleChangeCardData = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const toast = useToast();

  const editCardInDb = async () => {
    if (values.sentence && values.sentence_with_blank && values.word) {
      fetch(`/editCard/${currentDeck}`, {
        method: "PUT",
        body: JSON.stringify({ values }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          getCards();
          setEditingCard(false);
          toast({
            title: "Success",
            description: `You have successfully edited the card in deck: ${currentDeck}`,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description:
              "An error occurred. Please make sure all required fields have valid inputs.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const handleCancel = () => {
    setEditingCard(false);
  };

  return (
    <Flex mt={3} direction="column">
      <Text color="primary">
        Edit current card in deck:{" "}
        <strong>
          {prettyDeckLabels[currentDeck]
            ? prettyDeckLabels[currentDeck]
            : currentDeck}
        </strong>
      </Text>
      <Text>
        Any edits are not permanent, but could be modified or discarded in the
        future.
      </Text>
      <FormControl isRequired isInvalid={!values.sentence_with_blank}>
        <FormLabel mt={5}>Enter a sentence with a blank:</FormLabel>
        <Input
          placeholder="Enter a sentence with a blank (missing word)"
          name="sentence_with_blank"
          value={values.sentence_with_blank}
          onChange={handleChangeCardData}
          isRequired={true}
        />
        {!values.sentence_with_blank && (
          <FormErrorMessage>Sentence with blank is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isRequired isInvalid={!values.word}>
        <FormLabel mt={5}>Enter the answer:</FormLabel>
        <Input
          placeholder="Answer (missing word)"
          name="word"
          value={values.word}
          onChange={handleChangeCardData}
          isRequired={true}
        />
        {!values.word && (
          <FormErrorMessage>Answer is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isRequired isInvalid={!values.sentence}>
        <FormLabel mt={5}>Enter the Full Sentence:</FormLabel>
        <Input
          placeholder="Full Sentence"
          name="sentence"
          value={values.sentence}
          onChange={handleChangeCardData}
          isRequired={true}
        />
        {!values.sentence && (
          <FormErrorMessage>Full sentence is required.</FormErrorMessage>
        )}
      </FormControl>
      {/* <FormLabel mt={5}>Enter the Infinitive:</FormLabel>
      <Input
        placeholder="Infinitive"
        name="infinitive"
        value={values.infinitive}
        onChange={handleChangeCardData}
      />
      <FormLabel mt={5}>Enter the Definition:</FormLabel>
      <Input
        placeholder="Definition"
        name="definition"
        value={values.definition}
        onChange={handleChangeCardData}
      />
      <FormLabel mt={5}>Enter synonym(s):</FormLabel>
      <Input
        placeholder="Synonyms"
        name="synonyms"
        value={values.synonyms}
        onChange={handleChangeCardData}
      /> */}
      <Flex justify="center">
        <Button color="white" bgColor="primary" mt={5} onClick={editCardInDb}>
          Submit Changes
        </Button>
        <Button mt={5} ml={2} onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
}
