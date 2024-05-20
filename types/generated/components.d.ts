import type { Schema, Attribute } from '@strapi/strapi';

export interface TemplateTopicQuizCount extends Schema.Component {
  collectionName: 'components_template_topic_quiz_counts';
  info: {
    displayName: 'TopicQuizCount';
    description: '';
  };
  attributes: {
    topic: Attribute.Relation<
      'template.topic-quiz-count',
      'oneToOne',
      'api::topic.topic'
    >;
    number: Attribute.Integer;
    difficulty: Attribute.Enumeration<['Easy', 'Medium', 'Hard']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'template.topic-quiz-count': TemplateTopicQuizCount;
    }
  }
}
