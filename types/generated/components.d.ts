import type { Schema, Attribute } from '@strapi/strapi';

export interface TemplateTopicQuizCount extends Schema.Component {
  collectionName: 'components_template_topic_quiz_counts';
  info: {
    displayName: 'TopicQuizCount';
  };
  attributes: {
    topic: Attribute.Relation<
      'template.topic-quiz-count',
      'oneToOne',
      'api::topic.topic'
    >;
    number: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'template.topic-quiz-count': TemplateTopicQuizCount;
    }
  }
}
