import { PublishResourceType } from '@/generated/prisma';
import { Tooltip } from 'antd';

function ResourceVideo({ resourceOfVideo }: { resourceOfVideo?: string }) {
  // 如果resourceOfVideo存在，则获取文件名部分
  if (!resourceOfVideo) {
    return <div>-</div>;
  }

  // 从路径中提取文件名
  const fileName = resourceOfVideo.split('/').pop() || resourceOfVideo;

  return (
    <Tooltip title={resourceOfVideo}>
      <div>{fileName}</div>
    </Tooltip>
  );
}

function Resource({
  resourceType,
  resourceOfVideo,
}: {
  resourceType: PublishResourceType;
  resourceOfVideo?: string;
}) {
  if (resourceType === PublishResourceType.VIDEO) {
    return <ResourceVideo resourceOfVideo={resourceOfVideo} />;
  }

  return null;
}

export { Resource };
