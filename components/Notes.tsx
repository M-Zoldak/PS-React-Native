import { Box, Button, Input, List } from "native-base";
import { http_methods } from "../functions/HTTPMethods";
import { NoteType } from "../interfaces/EntityTypes/NoteType";
import { H2, H3, Text } from "./Themed";
import { useState } from "react";

type NotesType = { notes: NoteType[]; postUrl: string };

export default function Notes({ notes, postUrl }: NotesType) {
  const [newNote, setNewNote] = useState<string>("");
  const [notesInside, setNotes] = useState(notes);

  const addNote = () => {
    if (newNote.trim().length == 0) {
      return;
    }
    setNewNote("");
    http_methods.post<NoteType>(postUrl, { text: newNote }).then((note) => {
      setNotes([note, ...notesInside]);
    });
  };

  return (
    <>
      <Box mt={"auto"}>
        <H2 style={{ marginTop: 16, marginBottom: 16 }}>Notes</H2>
        <Input value={newNote} onChangeText={setNewNote} numberOfLines={4} />
        <Button
          style={{ marginTop: 16 }}
          onPress={addNote}
          disabled={newNote.length < 3}
        >
          Submit message
        </Button>
      </Box>
      <Box>
        {notesInside
          .sort((e1: NoteType, e2: NoteType) =>
            new Date(e1.createdAt.date) < new Date(e2.createdAt.date) ? 1 : 0
          )
          .map((note: NoteType, index: number) => {
            let date = new Date(note.createdAt.date);
            return (
              // <List.Item key={index}>
              <Box
                marginTop={index == 0 ? 0 : 1}
                padding={3}
                key={index}
                display={"flex"}
                flexDir={"row"}
                mt={2}
                borderWidth={1}
                borderColor={"gray.200"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                <Text>{`${note.user.name}`} </Text>
                <Text>{`${date.toLocaleDateString(
                  "pl"
                )} ${date.toLocaleTimeString("pl")}`}</Text>
                <Text style={{ width: "100%" }}>
                  {note.text.replace(new RegExp(/<[^>]*>/gm), "")}
                </Text>
              </Box>
            );
          })}
      </Box>
    </>
  );
}
