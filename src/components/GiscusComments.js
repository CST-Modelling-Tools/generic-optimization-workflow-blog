import React from 'react';
import Giscus from '@giscus/react';
import {useThemeConfig} from '@docusaurus/theme-common/internal';

export default function GiscusComments() {
  const {giscus} = useThemeConfig();
  if (!giscus) {
    return null;
  }

  return (
    <Giscus
      repo={giscus.repo}
      repoId={giscus.repoId}
      category={giscus.category}
      categoryId={giscus.categoryId}
      mapping={giscus.mapping}
      strict={giscus.strict}
      reactionsEnabled={giscus.reactionsEnabled}
      emitMetadata={giscus.emitMetadata}
      inputPosition={giscus.inputPosition}
      theme={giscus.theme}
      lang={giscus.lang}
      loading="lazy"
    />
  );
}
