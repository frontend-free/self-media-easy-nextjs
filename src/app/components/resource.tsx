import { PublishResourceType } from '@/generated/prisma';
import { Tooltip } from 'antd';

function ResourceVideo({ resourceOfVideo }: { resourceOfVideo?: string }) {
  // 如果resourceOfVideo存在，则获取文件名部分
  if (!resourceOfVideo) {
    return <div>-</div>;
  }

  const fileName = getFileNameWithExtension(resourceOfVideo);

  return (
    <Tooltip title={resourceOfVideo}>
      <div className="max-w-[150px] whitespace-normal break-words">{fileName}</div>
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

function getFileNameWithExtension(resourceOfVideo: string) {
  // 从路径中提取文件名，同时支持 Windows 和 Unix 风格的路径分隔符
  return resourceOfVideo.split(/[\/\\]/).pop() || resourceOfVideo;
}

function getFileName(resourceOfVideo: string) {
  if (!resourceOfVideo) {
    return '';
  }

  const fileNameWithExtension = getFileNameWithExtension(resourceOfVideo);
  return fileNameWithExtension.split('.').slice(0, -1).join('.');
}

export { getFileName, Resource };
