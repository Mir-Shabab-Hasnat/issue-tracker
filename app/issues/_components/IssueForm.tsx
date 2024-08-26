"use client";

import {
  Button,
  Callout,
  DropdownMenu,
  Grid,
  TextField,
} from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from "react-hook-form";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { Isssue } from "@prisma/client";
import { CheckIcon } from "@radix-ui/react-icons";

type IssueFormData = z.infer<typeof issueSchema>;
type StatusType = "OPEN" | "IN_PROGRESS" | "CLOSED" | undefined;

interface Props {
  issue?: Isssue;
}

const IssueForm = ({ issue }: { issue?: Isssue }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmmiting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusType>(issue?.status);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue)
        await axios.patch("/api/issues/" + issue.id, { ...data, status });
      else await axios.post("/api/issues", { ...data, status });
      router.push("/issues");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root
          defaultValue={issue?.title}
          placeholder="Title"
          {...register("title")}
        ></TextField.Root>

        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Grid columns="1" gap="5" width="10rem">
          {issue && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  Change Status
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.RadioGroup
                  value={status}
                  onValueChange={(value) => setStatus(value as StatusType)}
                >
                  <DropdownMenu.RadioItem value={"CLOSED"}>
                    Closed
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="OPEN">
                    Open
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="IN_PROGRESS">
                    In Progress
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
          <Button disabled={isSubmmiting}>
            {issue ? "Update Issue" : "Submit New Issue"}{" "}
            {isSubmmiting && <Spinner />}
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default IssueForm;
