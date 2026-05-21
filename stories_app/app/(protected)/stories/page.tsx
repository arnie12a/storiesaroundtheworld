"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  Grid,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { stories } from "@/lib/fakeStories";

export default function StoriesPage() {
  return (
    <Box maxW="1200px" mx="auto" px={6} py={12}>
      <Heading mb={10} fontSize="3xl" color="gray.100">
        My Stories
      </Heading>

      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={10}
      >
        {stories.map((story) => (
          <Card
            key={story.id}
            bg="gray.900"
            border="1px solid"
            borderColor="gray.700"
            rounded="xl"
            overflow="hidden"
            shadow="lg"
            _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
            transition="0.2s ease"
          >
            <Image
              src={story.photo_url}
              alt={story.title}
              objectFit="cover"
              h="220px"
              w="100%"
            />

            <CardBody>
              <Heading fontSize="xl" color="gray.100">
                {story.title}
              </Heading>

              <Text mt={2} color="gray.400" truncate>
                {story.description}
              </Text>

              <Text mt={4} fontSize="sm" color="gray.500">
                {story.city}, {story.country} — {story.story_date}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
